import { useState } from "react";
import { AddTourTypeModal } from "@/components/modules/Admin/TourType/AddTourModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useGetTourTypesQuery,
  useDeleteTourTypeMutation,
} from "@/redux/features/Tour/tour.api";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AddTourType() {
  const { data } = useGetTourTypesQuery(undefined);

  const [deleteTourType, { isLoading }] = useDeleteTourTypeMutation();

  // State to track which item is being deleted and if dialog is open
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Open confirmation dialog for specific tour type id
  function openDeleteDialog(id: string) {
    setSelectedDeleteId(id);
    setDialogOpen(true);
  }

  // Handle actual delete action
  async function handleDelete() {
    if (!selectedDeleteId) return;
    try {
      await deleteTourType(selectedDeleteId).unwrap();
      setDialogOpen(false);
      setSelectedDeleteId(null);
      toast.success("Tour Type Deleted");
    } catch (error) {
      console.error("Failed to delete tour type:", error);
      // optionally show error toast
    }
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-5'>
      <div className='flex justify-between my-8'>
        <h1 className='text-xl font-semibold'>Tour Types</h1>
        <AddTourTypeModal />
      </div>
      <div className='border border-muted rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Name</TableHead>
              <TableHead className='text-right'>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.data?.map((item: { _id: string; name: string }) => (
              <TableRow key={item._id}>
                <TableCell className='font-medium w-full'>
                  {item.name}
                </TableCell>
                <TableCell className='text-right'>
                  <Button
                    size='sm'
                    onClick={() => openDeleteDialog(item._id)}
                    disabled={isLoading}
                  >
                    <Trash2 />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this tour type?</p>
          <DialogFooter className='flex justify-end gap-2 mt-4'>
            <DialogClose asChild>
              <Button variant='outline'>Cancel</Button>
            </DialogClose>
            <Button onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
