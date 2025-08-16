import { useState } from "react";
import { DeleteConfirmation } from "@/components/DeleteConfirmation";
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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useGetTourTypesQuery,
  useDeleteTourTypeMutation,
  useRemoveTourTypeMutation,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  const { data } = useGetTourTypesQuery({ page: currentPage, limit });
  const [removeTourType] = useRemoveTourTypeMutation();

  const handleRemoveTourType = async (tourId: string) => {
    const toastId = toast.loading("Removing...");
    try {
      const res = await removeTourType(tourId).unwrap();

      if (res.success) {
        toast.success("Removed", { id: toastId });
      }
    } catch (err) {
      console.error(err);
    }
  };

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
  const totalPage = data?.meta?.totalPage || 1;

  //* Total page 2 => [0, 0]

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
              <TableRow>
                <TableCell className="font-medium w-full">
                  {item?.name}
                </TableCell>
                <TableCell>
                  <DeleteConfirmation
                    onConfirm={() => handleRemoveTourType(item._id)}
                  >
                    <Button size="sm">
                      <Trash2 />
                    </Button>
                  </DeleteConfirmation>
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
      {totalPage > 1 && (
        <div className="flex justify-end mt-4">
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {Array.from({ length: totalPage }, (_, index) => index + 1).map(
                  (page) => (
                    <PaginationItem
                      key={page}
                      onClick={() => setCurrentPage(page)}
                    >
                      <PaginationLink isActive={currentPage === page}>
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    className={
                      currentPage === totalPage
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
}
