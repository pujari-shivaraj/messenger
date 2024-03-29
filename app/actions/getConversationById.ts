import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUsers";


const getConversationById = async (
  conversationId: string
) => {
  try {


     

          
    if (!conversationId) {
      console.error("Invalid conversationId");
      return null;
    }

    console.log(conversationId)
       
    const currentUser = await getCurrentUser();

  



    if (!currentUser?.email) {
      return null;
    }
  
    const conversation = await prisma.conversation.findUnique({
      where: {
        id: conversationId
      },
      include: {
        users: true,
      }
    });

    return conversation;
  } catch (error: any) {
    console.log(error, 'SERVER_ERROR')
    return null;
  }
};

export default getConversationById;