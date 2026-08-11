import { useState } from "react";
import MemberItem from "./MemberItem";
import { useRemoveMember } from "@/lib/queries/halaqah";

export default function MembersSection({
  halaqah,
  halaqahId,
  colorMap,
  currentUserId,
}) {
  const [pendingRemove, setPendingRemove] = useState(null);

  const { mutate: removeMutate, isPending: isRemoving } =
    useRemoveMember(halaqahId);

  function handleConfirmRemove(targetUserId) {
    removeMutate(targetUserId, {
      onSuccess: (result) => {
        if (!result?.success) {
          console.error("[MembersSection] removeMember:", result?.error);
        }
        setPendingRemove(null);
      },
      onError: () => setPendingRemove(null),
    });
  }

  return (
    <div>
      <h4 className="text-xs font-bold uppercase tracking-widest text-text-secondary font-inter mb-3">
        Members
      </h4>
      <ul className="space-y-1.5">
        {halaqah.members.map((member) => (
          <MemberItem
            key={member.userId}
            member={member}
            colorMap={colorMap}
            currentUserId={currentUserId}
            pendingRemove={pendingRemove}
            setPendingRemove={setPendingRemove}
            handleConfirmRemove={handleConfirmRemove}
            isRemoving={isRemoving}
          />
        ))}
      </ul>
    </div>
  );
}
