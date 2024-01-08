import Link from "next/link";
import { use } from "react";
import { getHistories } from "~/services/graphql/history";

export default function NewsletterPage() {
  const histories = use(getHistories());

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium">History</h3>
        <p className="text-sm text-muted-foreground">
          Places you have visited since you joined.
        </p>
      </div>
      <section>
        <ol className="space-y-2">
          {histories.map((history) => (
            <li key={history.id} className="flex justify-between group">
              <Link
                href={history.pathname}
                className="text-base font-medium group-hover:underline"
              >
                {history.pathname}
              </Link>
              <time
                dateTime={history.createdAt}
                className="text-xs text-muted-foreground"
              >
                {new Intl.DateTimeFormat(undefined, {
                  dayPeriod: "narrow",
                }).format(new Date(history.createdAt))}
              </time>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
