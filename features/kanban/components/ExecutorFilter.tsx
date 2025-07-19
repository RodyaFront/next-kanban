import { getUsersForAssignment } from "@/shared/services/userService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface ExecutorFilterProps {
  value?: string;
  onChange: (assigneeId: string | undefined) => void;
  label?: string;
}

export const ExecutorFilter: React.FC<ExecutorFilterProps> = ({ value, onChange, label = "Executor" }) => {
  const users = getUsersForAssignment();
  return (
    <div>
      <label htmlFor="assignee-filter" className="block text-xs text-slate-400 mb-1">
        {label}
      </label>
      <Select
        value={value || "all"}
        onValueChange={val => {
          if (val === "all") onChange(undefined);
          else onChange(val);
        }}
      >
        <SelectTrigger className="w-48 bg-slate-700 border-slate-600 text-slate-100">
          <SelectValue placeholder="All executors" />
        </SelectTrigger>
        <SelectContent className="bg-slate-700 border-slate-600">
          <SelectItem value="all" className="text-slate-100">All executors</SelectItem>
          {users.map(user => (
            <SelectItem key={user.id} value={user.id} className="text-slate-100 flex items-center gap-2">
              <span className="flex items-center gap-2">
                {user.avatar && <img src={user.avatar} alt="avatar" className="w-5 h-5 rounded-full" />}
                {user.name}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}; 