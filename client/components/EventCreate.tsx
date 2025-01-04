'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { EventProps } from "../app/events/types"
import { fetchAdapter } from "@/adapters/fetchAdapter"
import { ReloadIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogFooter, DialogHeader, DialogClose, DialogDescription, DialogTitle, DialogTrigger, DialogContent } from "./ui/dialog"
import { PlusIcon } from "lucide-react";
import { CategoryProps } from '@/app/categories/types'
import { DateTimePicker } from "./DateTimePicker";

export type Event = {
    setEvents: Dispatch<SetStateAction<EventProps[]>>
}

export const CreateEvents = ({ setEvents }: Event) => {
    const [categories, setCategories] = useState<CategoryProps[]>([])
    const [category, setCategory] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [dhStart, setDhStart] = useState("")
    const [dhEnd, setDhEnd] = useState("")
    const [address, setAddress] = useState("")
    const [link, setLink] = useState("")
    const [peopleLimit, setPeopleLimit] = useState("")
    const [eventType, setEventType] = useState<"online" | "in-person" | "">(""); // Estado para armazenar o tipo de evento
    const [submitting, setSubmitting] = useState(false);
    const { toast } = useToast()
    console.log(category)
    const handleCreatedEvent = async (e: any) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetchAdapter({
                method: "POST",
                path: "events/create",
                body: {
                    title,
                    description,
                    dhStart,
                    dhEnd,
                    address,
                    people_limit: peopleLimit,
                    status: 'ACTIVATE',
                    categoriesId: Number(category)
                }
            })
            if (response.status == 200) {
                toast({
                    title: "Event registered successfully",
                    description: `Event: ${title}`
                })
                setEvents((prevEvents) => [...prevEvents, response.data])
            }
        } catch {
            toast({
                title: `Error`,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const getCategories = async () => {
        try {
            const response = await fetchAdapter({
                method: 'GET',
                path: 'categories'
            })
            if (response.status === 200) {
                setCategories(response.data)
                console.log(response)
            } else {
                toast({
                    variant: "destructive",
                    title: "Failed to load categories",
                })
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "There was an issue fetching the categories.",
            })
        }
    }

    useEffect(() => {
        getCategories();
    }, [])
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-indigo-500 hover:bg-indigo-600 w-56">
                    <PlusIcon className="w-3 h-3" /> New Event
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Event</DialogTitle>
                    <DialogDescription>Fill in the fields to add a new event</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreatedEvent}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Category
                            </Label>
                            <div className="col-span-3 flex items-center gap-2">
                                <Select onValueChange={setCategory}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <p className="mt-2 text-sm text-gray-500">
                                    Don't have a category? <br />
                                    <a href="/categories" className="text-indigo-500 hover:underline">
                                        Click here
                                    </a>
                                </p>
                            </div>
                        </div >
                        < div className="grid grid-cols-4 items-center gap-4" >
                            <Label htmlFor="title" className="text-right">
                                Title
                            </Label>
                            <Input id="title" className="col-span-3" value={title} onChange={(e) => {
                                setTitle(e.target.value)
                            }} />
                        </div >
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">
                                Type
                            </Label>
                            <Select onValueChange={(value) => setEventType(value as "online" | "in-person")}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="online">Online</SelectItem>
                                        <SelectItem value="in-person">In-person</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div >

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">
                                Description
                            </Label>
                            <Input id="description" className="col-span-3" value={description} onChange={(e) => {
                                setDescription(e.target.value)
                            }} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dhStart" className="text-right">
                                Start
                            </Label>
                            <DateTimePicker onChange={setDhStart} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="dhEnd" className="text-right">
                                Finish
                            </Label>
                            <DateTimePicker onChange={setDhEnd} />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">
                                Address
                            </Label>
                            <Input
                                id="address"
                                className={`col-span-3 ${eventType === "online" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={eventType === "online"}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="link" className="text-right">
                                Link
                            </Label>
                            <Input
                                id="link"
                                className={`col-span-3 ${eventType === "in-person" ? "bg-gray-100 cursor-not-allowed" : ""}`}
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                disabled={eventType === "in-person"}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="peopleLimit" className="text-right">
                                People Limit
                            </Label>
                            <Input id="peopleLimit" className="col-span-3" value={peopleLimit} onChange={(e) => {
                                setPeopleLimit(e.target.value)
                            }} />
                        </div>
                    </div >
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit" className="bg-indigo-500 hover:bg-indigo-600" disabled={submitting}>
                                {submitting ? (
                                    <ReloadIcon className="animate-spin" />
                                ) : (
                                    "Register"
                                )}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form >

            </DialogContent>
        </Dialog >
    )
}