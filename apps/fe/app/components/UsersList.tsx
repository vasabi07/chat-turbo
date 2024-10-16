"use client";
import React from "react";
import { useRecoilValue } from "recoil";
import { personalInfoAtom, usersListAtom } from "./atoms";
import User from "./User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface UserSchema {
  id: string;
  name: string;
  phone: string;
}

const UsersList = () => {
  const userslist = useRecoilValue<UserSchema[]>(usersListAtom);
  const { id, name, phone } = useRecoilValue(personalInfoAtom);
  console.log("this is user's list from recoil dq", userslist);

  return (
    <div>
      <ScrollArea className="h-screen w-[300px] overflow-auto">
      {userslist && userslist.length > 0 ? (
        <div>
          {/* Accordion component for sliding down info */}
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex justify-center ">
                <Avatar className="h-12 w-12 rounded-full ">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                ID: {id}
                <br />
                Name: {name}
                <br />
                Phone: {phone}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Mapping through the users list to render individual User components */}
          {userslist.map((user, index) => (
            <User key={index} user={user} />
          ))}
        </div>
      ) : (
        <p>No users found</p>
      )}
      </ScrollArea>
    </div>
  );
};

export default UsersList;
