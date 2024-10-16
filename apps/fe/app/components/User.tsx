import Link from "next/link";
import React from "react";

interface UserSchema {
  id: string;
  name: string;
  phone: string;
}

const User = ({
  user
}: {
  user: UserSchema;
}) => {
  return (
    <div className="border-b ">
      <Link href={`/chat/${user.id}`}>
        <div className="p-2 hover:bg-gray-100 cursor-pointer">
          <p className="text-lg font-semibold text-gray-800">{user.name}</p>
          <p className="text-sm text-gray-500">{user.phone}</p>
        </div>
      </Link>
    </div>
  );
};

export default User;
