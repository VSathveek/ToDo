import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import WhiteboardData, WhiteboardRoom

class WhiteboardConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'whiteboard_{self.room_name}'

        # Verify room exists
        if not await self.room_exists():
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    @database_sync_to_async
    def room_exists(self):
        return WhiteboardRoom.objects.filter(name=self.room_name).exists()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')
        
        if action == 'draw':
            # Broadcast drawing to all clients
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'whiteboard_draw',
                    'data': data
                }
            )
            
            # Save to database
            await self.save_whiteboard_data(data['elements'])
            
        elif action == 'clear':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'whiteboard_clear',
                    'data': data
                }
            )
            await self.clear_whiteboard_data()

    @database_sync_to_async
    def save_whiteboard_data(self, elements):
        room = WhiteboardRoom.objects.get(name=self.room_name)
        whiteboard_data, created = WhiteboardData.objects.get_or_create(room=room)
        whiteboard_data.data = {'elements': elements}
        whiteboard_data.save()

    @database_sync_to_async
    def clear_whiteboard_data(self):
        room = WhiteboardRoom.objects.get(name=self.room_name)
        whiteboard_data, created = WhiteboardData.objects.get_or_create(room=room)
        whiteboard_data.data = {'elements': []}
        whiteboard_data.save()

    async def whiteboard_draw(self, event):
        await self.send(text_data=json.dumps(event['data']))

    async def whiteboard_clear(self, event):
        await self.send(text_data=json.dumps(event['data']))