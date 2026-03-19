import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useCreateListing } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Gift, ImagePlus } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CreateListingInputCategory, CreateListingInputAgeGroup, CreateListingInputCondition } from "@workspace/api-client-react";

const formSchema = z.object({
  title: z.string().min(5, "Title is too short").max(100),
  description: z.string().min(10, "Provide a bit more detail").max(1000),
  price: z.coerce.number().min(0).max(5000, "Maximum price is 5000 NGN"),
  category: z.nativeEnum(CreateListingInputCategory),
  ageGroup: z.nativeEnum(CreateListingInputAgeGroup),
  condition: z.nativeEnum(CreateListingInputCondition),
  imageUrl: z.string().url("Must be a valid image URL"), // Mock single upload
  state: z.string().min(2, "Required"),
  city: z.string().min(2, "Required"),
  giftItForward: z.boolean(),
});

export default function CreateListing() {
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      category: CreateListingInputCategory.Clothes,
      ageGroup: CreateListingInputAgeGroup["0-6m"],
      condition: CreateListingInputCondition.Good,
      imageUrl: "",
      state: "Lagos",
      city: "",
      giftItForward: false,
    },
  });

  const isGift = form.watch("giftItForward");

  const createMutation = useCreateListing({
    mutation: {
      onSuccess: (data) => {
        toast({ title: "Yay! Listing created", description: "Your item is now live." });
        setLocation(`/listings/${data.id}`);
      },
      onError: (err: any) => {
        toast({ variant: "destructive", title: "Failed to create", description: err.error || "An error occurred." });
      }
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createMutation.mutate({
      data: {
        ...values,
        price: values.giftItForward ? 0 : values.price,
        images: [values.imageUrl], // Send array as required by API
      }
    });
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Sell an Item</h1>
          <p className="text-muted-foreground text-lg">Turn outgrown items into extra cash, or gift them forward.</p>
        </div>

        <Card className="p-6 md:p-10 rounded-[2.5rem] shadow-xl border-border/50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              {/* Image Mock */}
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">Image URL</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input placeholder="https://..." {...field} className="h-12 pl-10 rounded-xl" />
                        <ImagePlus className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel className="text-base font-bold">What are you selling?</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Blue Denim Overalls" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CreateListingInputCategory).map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ageGroup"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Age Group / Size</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select age group" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CreateListingInputAgeGroup).map((age) => (
                            <SelectItem key={age} value={age}>{age}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">Condition</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl">
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(CreateListingInputCondition).map((cond) => (
                            <SelectItem key={cond} value={cond}>{cond}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="giftItForward"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-xl border-2 p-3 bg-orange-50 border-orange-200">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base font-bold flex items-center text-orange-800">
                            <Gift className="w-4 h-4 mr-2" /> Gift-It-Forward
                          </FormLabel>
                          <p className="text-xs text-orange-700/80">Give away for free!</p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-bold">Price (NGN) - Max 5,000</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            disabled={isGift} 
                            placeholder={isGift ? "0" : "Amount"} 
                            {...field} 
                            value={isGift ? 0 : field.value}
                            className="h-12 rounded-xl text-lg font-bold text-primary" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-bold">Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell buyers about this item. Any stains? How often was it used?" 
                        className="resize-none h-32 rounded-xl"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">State</FormLabel>
                      <FormControl>
                        <Input {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-bold">City / Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ikeja" {...field} className="h-12 rounded-xl" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-16 rounded-full text-xl font-bold shadow-xl shadow-primary/30 hover-elevate"
                disabled={createMutation.isPending}
              >
                {createMutation.isPending ? "Posting..." : "Publish Listing"}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </AppLayout>
  );
}
