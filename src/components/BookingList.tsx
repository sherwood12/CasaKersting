import React from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Calendar as CalendarIcon, Users, Utensils, X } from 'lucide-react';
import type { BookingData } from './BookingForm';
import { Button } from './ui/button';

interface BookingListProps {
  bookings: BookingData[];
  onDelete: (index: number) => void;
}

export function BookingList({ bookings, onDelete }: BookingListProps) {
  const sortedBookings = [...bookings].sort((a, b) => {
    if (!a.dateRange.from || !b.dateRange.from) return 0;
    return a.dateRange.from.getTime() - b.dateRange.from.getTime();
  });

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Kommende Aufenthalte</h2>
      {sortedBookings.length === 0 ? (
        <p className="text-neutral-500">Noch keine Buchungen vorhanden</p>
      ) : (
        <div className="space-y-4">
          {sortedBookings.map((booking, index) => (
            <div
              key={index}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 text-neutral-400 hover:text-red-500"
                onClick={() => onDelete(index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-neutral-600">
                <CalendarIcon className="h-4 w-4" />
                <span>
                  {booking.dateRange.from &&
                    format(booking.dateRange.from, 'dd. MMMM yyyy', { locale: de })} -{' '}
                  {booking.dateRange.to &&
                    format(booking.dateRange.to, 'dd. MMMM yyyy', { locale: de })}
                </span>
              </div>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-neutral-500" />
                  <span>
                    {booking.guests} {booking.guests === 1 ? 'Gast' : 'Gäste'}
                  </span>
                </div>
                {booking.guestNames && (
                  <p className="text-sm text-neutral-600 pl-6">
                    {booking.guestNames}
                  </p>
                )}
                {Object.entries(booking.dietaryRequirements).some(([_, value]) => value) && (
                  <div className="flex items-start gap-2">
                    <Utensils className="h-4 w-4 mt-0.5 text-neutral-500" />
                    <div className="text-sm">
                      {Object.entries(booking.dietaryRequirements)
                        .filter(([key, value]) => value && key !== 'none')
                        .map(([key]) => {
                          const labels: Record<string, string> = {
                            vegan: 'Vegan',
                            vegetarian: 'Vegetarisch',
                            glutenFree: 'Glutenfrei',
                            lactoseFree: 'Laktosefrei',
                          };
                          return labels[key];
                        })
                        .join(', ') || 'Keine besonderen Wünsche'}
                    </div>
                  </div>
                )}
                {booking.comments && (
                  <p className="mt-2 text-sm text-neutral-600 border-t border-neutral-100 pt-2">
                    {booking.comments}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}