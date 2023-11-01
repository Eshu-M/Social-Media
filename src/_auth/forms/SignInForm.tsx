
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod" 
import { useForm } from "react-hook-form"
import {Form,FormControl,FormDescription,FormField,FormItem,FormLabel,FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignInValidation } from "@/lib/validation"
import {z} from 'zod'
import Loader from "@/components/ui/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"


const SignInForm = () => {
  const {toast}=useToast();
  const navigate=useNavigate();
  const {checkAuthUser , isLoading:isUserLoading} = useUserContext();
  const {mutateAsync:signInAccount}=useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email:'',
      password:'',
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    
    const session = await signInAccount({
      email:values.email,
      password:values.password,
    })

    if(!session){
      return toast({title:'Sign in failed. Please try again.'})
    }

    const isLoggedIn = await checkAuthUser();
    if(isLoggedIn){
      form.reset();
      navigate('/');
    }else{
      toast({title:'Sign In failed. Please try again.'});
    }
  }
  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
         <img src="/assets/images/logo.svg" alt="logo" />
         <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
         <p>Welcome back please enter your details.</p>
      
         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
           <FormField
             control={form.control}
             name="email"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Email</FormLabel>
                 <FormControl>
                   <Input {...field} type="email" className="shad-input"/>
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <FormField
             control={form.control}
             name="password"
             render={({ field }) => (
               <FormItem>
                 <FormLabel>Password</FormLabel>
                 <FormControl>
                   <Input {...field} type="password" className="shad-input"/>
                 </FormControl>
                 <FormMessage />
               </FormItem>
             )}
           />
           <Button type="submit" className="shad-button_primary">
           {isUserLoading ? (
            <div className="flex-center gap-2">
              <Loader/> Loading...
            </div>
           ): (
            'Log in'
           )
           }</Button>

           <p className="text-small-regular text-light-2 text-center mt-2">
            Don't have an account?
            <Link to={'/sign-up'} className="text-primary-500 text-small-semibold ml-1">
              Sign up
            </Link>
           </p>
         </form>
    </div>
  </Form>
  )
}

export default SignInForm