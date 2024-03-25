"use client";
import {
  Check,
  Edit,
  HelpCircle,
  MoreHorizontal,
  Send,
  Trash,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Remplacement } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ApprouverForm } from "./ApprouverForm";
import { AlertModal } from "@/components/ui/alert-modal";

interface CellActionProps {
  data: Remplacement;
}
export default function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const closeDialog = () => setOpenDialog(false);
  const envoyerCourriel = async () => {
    try {
      setLoading(true);

      // If the email has already been sent today, we don't want to add a new date to the array
      // We only want to add a new date if it's the first email sent today
      const isFirstEmailToday =
        data.courrielEnvoye.length > 0 &&
        new Date(data.courrielEnvoye[0]).setHours(0, 0, 0, 0) ===
          new Date().setHours(0, 0, 0, 0);
      if (!isFirstEmailToday) {
        data.courrielEnvoye.unshift(new Date());
      }

      await axios.patch(`/api/${data.id}`, {
        ...data,
      });
      router.refresh();
      toast({ title: "Envoi du courriel aux équipiers confirmé." });
    } catch (error) {
      toast({
        title: "Erreur",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${data.id}`);
      router.refresh();
      toast({ title: "Remplacement supprimé" });
    } catch (error) {
      toast({
        title:
          "an error occurred while deleting the item, please try again later",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
        onConfirm={onDelete}
      />
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                router.push(`/${data.id}`);
              }}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </DropdownMenuItem>
            {data.statut === "en attente" && (
              <DropdownMenuItem onClick={envoyerCourriel}>
                <Send className="h-4 w-4 mr-2" />
                Confirmer courriel
              </DropdownMenuItem>
            )}

            {data.statut === "en attente" && data.courrielEnvoye.length > 0 && (
              <DialogTrigger asChild>
                <DropdownMenuItem>
                  <Check className=" h-4 w-4 mr-2" />
                  Approuver
                </DropdownMenuItem>
              </DialogTrigger>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="h-4 w-4 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
          <DialogContent>
            <TooltipProvider delayDuration={200}>
              <DialogHeader>
                <DialogTitle className="flex gap-2 items-center">
                  Approuver le remplacement
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className=" text-muted-foreground hover:fill-muted " />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className=" p-4 space-y-4">
                      <h1 className="text-lg">Ne pas oublier de: </h1>
                      <p className=" text-muted-foreground">
                        1. Échanger les quarts concernés dans workday
                      </p>
                      <p className=" text-muted-foreground">
                        2. Remplacer les noms dans l'horaire des pauses
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </DialogTitle>
                <ApprouverForm initialData={data} closeDialog={closeDialog} />
              </DialogHeader>
            </TooltipProvider>
          </DialogContent>
        </DropdownMenu>
      </Dialog>
    </>
  );
}
