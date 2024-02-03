import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUsers";

import prisma from "@/app/libs/prismadb";

import { pusherServer } from '@/app/libs/pusher'






export async function POST(
    request: Request, 
  ) {             console.log("seen1")
           
         try{
          const currentUser = await getCurrentUser();
          
          const body = await request.json();
          console.log(body)
          const {
            message,
            image,
            conversationid
          } = body;
          console.log("seen2")
          if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
          }

          console.log("seen3")
          const newMessage = await prisma.message.create({
            include: {
              seen: true,
              sender: true
            },
            data: {
              body: message,
              image: image,
              conversation: {
                connect: { id: conversationid }
              },
              sender: {
                connect: { id: currentUser.id }
              },
              seen: {
                connect: {
                  id: currentUser.id
                }
              },
            }


          });
          console.log("seen4")
          const updatedConversation = await prisma.conversation.update({
            where: {
              id: conversationid
            },
            data: {
              lastMessageAt: new Date(),
              messages: {
                connect: {
                  id: newMessage.id
                }
              }
            },
            include: {
              users: true,
              messages: {
                include: {
                  seen: true
                }
              }    
            }
          });
          console.log("seen5")
          await pusherServer.trigger(conversationid, 'messages:new', newMessage);

          const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];
      
          updatedConversation.users.map((user) => {
            pusherServer.trigger(user.email!, 'conversation:update', {
              id: conversationid,
              messages: [lastMessage]
            });
          });
          
          console.log("seen6")
          

          return NextResponse.json(newMessage);
            

         }catch(error:any){

            console.log(error,'ERROR_MESSAGES');
            console.log(error)
            return new NextResponse('InternalError',{ status:500});
            console.log("seen1")
    }




  }


  //4:45:07