"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Remplacement } from "@prisma/client";
import axios from "axios";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { fi, tr } from "date-fns/locale";

interface RemplacementFormProps {
  initialData: Remplacement | null;
}
const formSchema = z.object({
  nomEquipier: z.string().min(2, {
    message: "nomEquipier must be at least 2 characters.",
  }),
  dateDemande: z.date({ required_error: "dateDemande is required." }),
  recuPar: z.string().min(2, {
    message: "recuPar must be at least 2 characters.",
  }),
  dateQuart: z.date({ required_error: "dateQuart is required." }),
  posteQuart: z.string({ required_error: "posteQuart is required." }),
  heuresQuart: z.string({ required_error: "heuresQuart is required." }),
  courrielEnvoye: z.enum(["true", "false"]),
  statut: z.enum(["en attente", "approuvé", "non remplacé"], {
    required_error: "Selectionner un statut.",
  }),
  nomEquipierRemplacant: z.string().optional(),
  remplacementEffectuePar: z.string().optional(),
});

export function ModificationForm({ initialData }: RemplacementFormProps) {
  const params = useParams();
  const router = useRouter();

  const formatted = new Intl.DateTimeFormat("fr-CA", {
    day: "2-digit",
    month: "short",
  }).format(new Date());

  const [loading, setLoading] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          statut:
            initialData.statut === "en attente"
              ? "en attente"
              : initialData.statut === "approuvé"
              ? "approuvé"
              : "non remplacé",
          courrielEnvoye:
            initialData.courrielEnvoye.length > 0 ? "true" : "false",
          nomEquipierRemplacant: initialData.nomEquipierRemplacant ?? "",
          remplacementEffectuePar: initialData.remplacementEffectuePar ?? "",
        }
      : { courrielEnvoye: "false" },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      if (values.statut === "approuvé") {
        if (
          values.nomEquipierRemplacant?.trim().length === 0 ||
          !values.nomEquipierRemplacant
        )
          throw new Error(
            "nomEquipierRemplacant required because statut is approuvé"
          );

        if (
          values.remplacementEffectuePar?.trim().length === 0 ||
          !values.remplacementEffectuePar
        )
          throw new Error(
            "remplacementEffectuePar required because statut is approuvé"
          );
      }

      if (initialData) {
        let courrielEnvoye = initialData.courrielEnvoye;
        if (
          initialData.courrielEnvoye.length <= 0 &&
          values.courrielEnvoye === "true"
        ) {
          courrielEnvoye.unshift(new Date());
        }
        if (values.courrielEnvoye === "false") {
          courrielEnvoye = [];
        }
        await axios.patch(`/api/${initialData.id}`, {
          ...values,
          courrielEnvoye,
        });
        router.refresh();
        router.push("/");
        toast({ title: "Remplacement modifié avec succès." });
      } else {
        await axios.post("/api", values);
        router.push("/");
        toast({ title: "Remplacement ajouté avec succès." });
      }
    } catch (error) {
      toast({ title: "something went wrong" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex w-full justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 flex flex-col gap-6 items-start"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start w-full ">
            <FormField
              control={form.control}
              name="nomEquipier"
              render={({ field }) => (
                <FormItem className=" md:basis-60 shrink-0">
                  <FormLabel>Nom de l'équipier</FormLabel>
                  <FormControl>
                    <Input placeholder="Dwight Schrute" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateDemande"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="mt-1 pt-0.5 mb-1">
                    Date de la demande
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    La date à laquelle la demande a été faite.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recuPar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reçue par:</FormLabel>
                  <FormControl>
                    <Input placeholder="Michael Scott" {...field} />
                  </FormControl>
                  <FormDescription>
                    Le nom du directeur qui a reçu la demande.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row gap-6 items-start w-full ">
            <FormField
              control={form.control}
              name="dateQuart"
              render={({ field }) => (
                <FormItem className="flex flex-col ">
                  <FormLabel className="mt-1 pt-0.5 mb-1">
                    Date du quart
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date("1900-01-01")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    La date du quart à remplacer.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="posteQuart"
              render={({ field }) => (
                <FormItem className="w-60">
                  <FormLabel>Poste</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner le poste du quart" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Plancher">Plancher</SelectItem>
                      <SelectItem value="Concession">Concession</SelectItem>
                      <SelectItem value="Café">Café</SelectItem>
                      <SelectItem value="Billetterie">Billetterie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="heuresQuart"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Heures du quart</FormLabel>
                  <FormControl>
                    <Input placeholder="11h30 - 18h" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="courrielEnvoye"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Courriel envoyé?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="true" />
                        </FormControl>
                        <FormLabel className="font-normal">Oui</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="false" />
                        </FormControl>
                        <FormLabel className="font-normal">Non</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Separator />

          <div className="flex flex-col md:flex-row gap-6 items-start w-full ">
            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Statut</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="en attente"
                            className="text-yellow-800"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          En attente
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="approuvé"
                            className="text-green-800"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">Approuvé</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            value="non remplacé"
                            className=" text-red-800"
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Non remplacé
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nomEquipierRemplacant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remplaçant</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathieu L." {...field} />
                  </FormControl>
                  <FormDescription>
                    Le nom de l'équipier qui effectuera le remplacement.
                  </FormDescription>
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
                  <FormDescription>
                    Le nom du directeur qui a effectué le remplacement.
                  </FormDescription>
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
            SAUVEGARDER LES CHANGEMENTS
          </Button>
        </form>
      </Form>
    </div>
  );
}
