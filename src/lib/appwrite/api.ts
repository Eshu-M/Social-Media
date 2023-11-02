import {ID, Query} from 'appwrite';
import { INewPost, INewUser } from "@/types";
import { account, appwriteConfig, avatars, database, storage } from "./config";


export async function createUserAccount(user :INewUser) {
    try {
        const newAccount =await account.create(
            ID.unique(),
             user.email,
             user.password,
             user.name,
        );
        if(!newAccount) throw Error;

        const avatarUrl=avatars.getInitials(user.name);
        const newUser = await savesUserToDB({
            accountId:newAccount.$id,
            name:newAccount.name,
            email:newAccount.email,
            username:user.username,
            imageUrl:avatarUrl,
        });
        return newUser; 
    } catch (error) {
        console.log(error);
        return error;
    }
}

export async function savesUserToDB(user:{
    accountId:string,
    name:string,
    email:string,
    username?:string,
    imageUrl:URL,
}) {
   try {
    const newUser = await database.createDocument(
       appwriteConfig.databaseId ,
       appwriteConfig.userCollection,
       ID.unique(),
       user,
    )
    return newUser
   } catch (error) {
    console.log(error);
   } 
}

export async function signInAccount(user:{email:string ; password:string}){
    try {
        const session =await account.createEmailSession(user.email , user.password);
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function getCurrentUser() {
    try {
        const currentAccount= await account.get();
        if(!currentAccount)throw Error;

        const currentUser=await database.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollection,
            [Query.equal('accountId',currentAccount.$id)]
        )
        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export async function signOutAccount() {
    try {
        const session =await account.deleteSession("current");
        return session;
    } catch (error) {
        console.log(error);
    }
}

export async function createPost(post: INewPost) {
    try {
      // Upload file to appwrite storage
      const uploadedFile = await uploadFile(post.file[0]);
  
      if (!uploadedFile) throw Error;
  
      // Get file url
      const fileUrl = getFilePreview(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      // Convert tags into array
      const tags = post.tags?.replace(/ /g, "").split(",") || [];
  
      // Create post
      const newPost = await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollection,
        ID.unique(),
        {
          creator: post.userId,
          caption: post.caption,
          imageUrl: fileUrl,
          imageId: uploadedFile.$id,
          location: post.location,
          tags: tags,
        }
      );
  
      if (!newPost) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }
  
      return newPost;
    } catch (error) {
      console.log(error);
    }
  }

  export async function uploadFile(file: File) {
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        file
      );
  
      return uploadedFile;
    } catch (error) {
      console.log(error);
    }
  }

  export async function deleteFile(fileId: string) {
    try {
      await storage.deleteFile(appwriteConfig.storageId, fileId);
  
      return { status: "ok" };
    } catch (error) {
      console.log(error);
    }
  }
  
  export function getFilePreview(fileId: string) {
    try {
      const fileUrl = storage.getFilePreview(
        appwriteConfig.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      console.log(error);
    }
  }

  export async function getRecentPosts() {
    try {
      const posts = await database.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollection,
        [Query.orderDesc("$createdAt"), Query.limit(20)]
      );
  
      if (!posts) throw Error;
  
      return posts;
    } catch (error) {
      console.log(error);
    }
  }

  export async function likePost(postId:string , likesArray:string[]) {
    try {
      const updatedPost=await database.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postCollection,
        postId,
        {
          likes:likesArray
        }
      )
      if(!updatedPost) throw Error;
      return updatedPost;
    } catch (error) {
      console.log(error);
    }
  }
  export async function savePost(postId:string , userId:string) {
    try {
      const savedPost=await database.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollection,
        ID.unique(),
        {
          user :userId,
          post:postId,
        }
      )
      if(!savedPost) throw Error;
      return savedPost;
    } catch (error) {
      console.log(error);
    }
  }
  export async function deleteSavedPost(savedRecordId:string) {
    try {
      const statusCode=await database.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.savesCollection,
        savedRecordId,
      )
      if(!statusCode) throw Error;
      return {status:'ok'};
    } catch (error) {
      console.log(error);
    }
  }