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
import axios from "axios";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  nomEquipier: z.string().min(1, {
    message: "Le nom de l'équipier est requis.",
  }),
  dateDemande: z.date({ required_error: "La date de la demande est requise." }),
  recuPar: z.string().min(1, {
    message: "Le nom du directeur est requis.",
  }),
  dateQuart: z.date({ required_error: "La date du quart est requise." }),
  posteQuart: z.string({ required_error: "Le poste du quart est requis." }),
  heuresQuart: z.string({
    required_error: "Les heures du quart sont requises",
  }),
});

export function NouvelleDemandeForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateDemande: new Date(),
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      await axios.post(`/api`, values);

      router.refresh();
      router.push("/");
      toast({ title: "Remplacement ajouté avec succès." });
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
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="self-center w-fit"
          >
            SOUMETTRE
          </Button>
        </form>
      </Form>
    </div>
  );
}
