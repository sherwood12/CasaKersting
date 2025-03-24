import React, { useState } from 'react';
import { ChevronDown, Book, Bell } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { GuestBook } from './GuestBook';
import { News } from './News';

export function Menu() {
  const [activeSection, setActiveSection] = useState<'guestbook' | 'news' | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Collapsible
          open={activeSection === 'guestbook'}
          onOpenChange={(open) => setActiveSection(open ? 'guestbook' : null)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm hover:bg-neutral-50">
            <div className="flex items-center gap-2">
              <Book className="h-5 w-5 text-neutral-500" />
              <span className="font-medium">Urlaubstagebuch</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-neutral-500 transition-transform ${
              activeSection === 'guestbook' ? 'rotate-180' : ''
            }`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <GuestBook />
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible
          open={activeSection === 'news'}
          onOpenChange={(open) => setActiveSection(open ? 'news' : null)}
        >
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-3 text-left shadow-sm hover:bg-neutral-50">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-neutral-500" />
              <span className="font-medium">Neuigkeiten</span>
            </div>
            <ChevronDown className={`h-5 w-5 text-neutral-500 transition-transform ${
              activeSection === 'news' ? 'rotate-180' : ''
            }`} />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <div className="rounded-lg border border-neutral-200 bg-white p-4">
              <News />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}