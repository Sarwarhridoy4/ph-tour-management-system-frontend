import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAddTourTypeMutation } from "@/redux/features/Tour/tour.api";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";

type ITourType = {
  name: string;
};

export function AddTourTypeModal() {
  const [open, setOpen] = useState(false); // control dialog open/close
  const form = useForm<ITourType>();
  const [addTourType, { isLoading }] = useAddTourTypeMutation();

  const onSubmit: SubmitHandler<ITourType> = async (data) => {
    try {
      const res = await addTourType({ name: data.name }).unwrap();
      if (res.success) {
        toast.success("Tour Type Added");
        form.reset();
        setOpen(false); // Close dialog on success
      } else {
        toast.error("Failed to add Tour Type");
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Tour Type</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Add Tour Type</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form id='add-tour-type' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tour Type Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Tour Type Name'
                      {...field}
                      value={field.value || ""}
                      disabled={isLoading} // disable input while submitting
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline' disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button type='submit' form='add-tour-type' disabled={isLoading}>
            {isLoading ? "Saving..." : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
