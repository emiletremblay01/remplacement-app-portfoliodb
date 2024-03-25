"use client";

import axios from "axios";
import { useState } from "react";
import { Remplacement } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  nomEquipierRemplacant: z.string().min(1, {
    message: "Le nom du remplaçant est requis.",
  }),
  remplacementEffectuePar: z.string().min(1, {
    message: "Le nom du directeur est requis.",
  }),
});

export function ApprouverForm({
  initialData,
  closeDialog,
}: {
  initialData: Remplacement | null;
  closeDialog: () => void;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          nomEquipierRemplacant: initialData.nomEquipierRemplacant ?? "",
          remplacementEffectuePar: initialData.remplacementEffectuePar ?? "",
        }
      : {
          nomEquipierRemplacant: "",
          remplacementEffectuePar: "",
        },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      if (initialData) {
        initialData.statut = "approuvé";
        const request = {
          ...initialData,
          nomEquipierRemplacant: values.nomEquipierRemplacant,
          remplacementEffectuePar: values.remplacementEffectuePar,
        };
        console.log(request);
        await axios.patch(`/api/${initialData.id}`, request);
        router.push("/");
        toast({ title: "Remplacement approuvé avec succès." });
        router.refresh();
      } else {
        await axios.post("/api", values);
        router.push("/");
        toast({ title: "Remplacement ajouté avec succès." });
      }
      closeDialog();
    } catch (error) {
      toast({ title: "something went wrong" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full justify-center pt-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-6 items-center"
        >
          <div className="w-2/3 max-w-md  space-y-4">
            <FormField
              control={form.control}
              name="nomEquipierRemplacant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remplaçant</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathieu L." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remplacementEffectuePar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remplacement effectué par:</FormLabel>
                  <FormControl>
                    <Input placeholder="Samuel C." {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="self-center w-fit"
          >
            APPROUVER
          </Button>
        </form>
      </Form>
    </div>
  );
}
