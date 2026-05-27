import Image from "next/image";

import { SectionHeader } from "@/components/site/SectionHeader";
import { getHomeTeam } from "@/lib/queries/team";

export async function Team() {
  const team = await getHomeTeam();
  if (team.length === 0) return null;

  return (
    <section className="bg-surface-tint">
      <div className="mx-auto max-w-content px-6 py-12 md:py-24">
        <SectionHeader
          label="Our team"
          heading="On the ground in Guangzhou."
          description="The people inspecting your car, negotiating with the factory, and filing your export paperwork."
        />
        <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {team.map((member) => (
            <li key={member.id} className="flex flex-col gap-4">
              <div className="relative w-full aspect-[3/4] overflow-hidden bg-background">
                <Image
                  src={member.photo_url ?? "/placeholders/team-portrait.svg"}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col gap-1.5 border-t border-hairline pt-4">
                <p className="text-[16px] font-medium leading-tight text-corporate-black">
                  {member.name}
                </p>
                <p className="text-[13px] font-normal leading-[1.4] text-text-secondary">
                  {member.role}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
