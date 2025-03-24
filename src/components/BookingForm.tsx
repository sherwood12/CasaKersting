import React, { useState, useRef } from 'react';
import { addDays, format } from 'date-fns';
import { de } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { Calendar } from './ui/calendar';

interface BookingFormProps {
  onSubmit: (bookingData: BookingData) => void;
  existingBookings: BookingData[];
}

export interface BookingData {
  dateRange: DateRange;
  guests: number;
  guestNames: string;
  dietaryRequirements: {
    vegan: boolean;
    vegetarian: boolean;
    glutenFree: boolean;
    lactoseFree: boolean;
    none: boolean;
  };
  comments: string;
}

export function BookingForm({ onSubmit, existingBookings }: BookingFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState(1);
  const [guestNames, setGuestNames] = useState('');
  const [dietary, setDietary] = useState({
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    lactoseFree: false,
    none: false,
  });
  const [comments, setComments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getTotalGuestsForDate = (date: Date) => {
    return existingBookings.reduce((total, booking) => {
      const bookingStart = booking.dateRange.from;
      const bookingEnd = booking.dateRange.to;
      if (!bookingStart || !bookingEnd) return total;
      
      if (date >= bookingStart && date <= bookingEnd) {
        return total + booking.guests;
      }
      return total;
    }, 0);
  };

  const isDateDisabled = (date: Date) => {
    const totalGuests = getTotalGuestsForDate(date);
    return totalGuests >= 6;
  };

  const getRemainingCapacity = (start: Date, end: Date) => {
    let minCapacity = 6;
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
      const totalGuests = getTotalGuestsForDate(currentDate);
      const remainingForDay = 6 - totalGuests;
      minCapacity = Math.min(minCapacity, remainingForDay);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return minCapacity;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!dateRange?.from || !dateRange?.to) {
      setError('Bitte wählen Sie ein Start- und Enddatum aus');
      return;
    }

    if (guests > 6) {
      setError('Maximale Anzahl von 6 Gästen überschritten');
      return;
    }

    const remainingCapacity = getRemainingCapacity(dateRange.from, dateRange.to);
    
    if (remainingCapacity < guests) {
      setError(`Für diesen Zeitraum sind nur noch ${remainingCapacity} Plätze verfügbar`);
      return;
    }

    const bookingData: BookingData = {
      dateRange,
      guests,
      guestNames,
      dietaryRequirements: dietary,
      comments,
    };

    try {
      if (!formRef.current) return;

      // Prepare dietary requirements string
      const dietaryRequirements = Object.entries(dietary)
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
        .join(', ');

      // Create a temporary form for EmailJS
      const tempForm = document.createElement('form');
      
      // Add hidden inputs with the correct names
      const formFields = {
        'guest_names': guestNames || 'Keine Namen angegeben',
        'date_range': `${format(dateRange.from, 'dd.MM.yyyy', { locale: de })} - ${format(dateRange.to, 'dd.MM.yyyy', { locale: de })}`,
        'guests': guests.toString(),
        'diet': dietaryRequirements || 'Keine besonderen Wünsche',
        'comment': comments || 'Kein Kommentar'
      };

      // Add each field to the form
      Object.entries(formFields).forEach(([name, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        tempForm.appendChild(input);
      });

      // Send email using EmailJS
      await emailjs.sendForm(
        'service_0euz51o',
        'template_d2xgu3e',
        tempForm,
        'bJFqmcvmBLLTXBa16'
      );

      onSubmit(bookingData);
      setSuccess('Buchung erfolgreich gesendet!');
      
      // Reset form
      setDateRange(undefined);
      setGuests(1);
      setGuestNames('');
      setDietary({
        vegan: false,
        vegetarian: false,
        glutenFree: false,
        lactoseFree: false,
        none: false,
      });
      setComments('');
    } catch (error) {
      console.error('EmailJS error:', error);
      setError('Es gab ein Problem beim Senden der Buchung.');
    }
  };

  const selectedRangeCapacity = dateRange?.from && dateRange?.to 
    ? getRemainingCapacity(dateRange.from, dateRange.to)
    : null;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label>Zeitraum auswählen</Label>
        <Calendar
          mode="range"
          selected={dateRange}
          onSelect={setDateRange}
          disabled={isDateDisabled}
          locale={de}
          className="rounded-md border bg-white"
          fromDate={new Date()}
          toDate={addDays(new Date(), 365)}
        />
        {selectedRangeCapacity !== null && (
          <p className="text-sm text-neutral-600">
            Verfügbare Plätze für diesen Zeitraum: {selectedRangeCapacity}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="guests">Anzahl der Gäste</Label>
          <input
            type="number"
            id="guests"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            min="1"
            max={selectedRangeCapacity !== null ? selectedRangeCapacity : 6}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2"
          />
        </div>

        <div>
          <Label htmlFor="guestNames">Namen der Gäste (optional)</Label>
          <textarea
            id="guestNames"
            value={guestNames}
            onChange={(e) => setGuestNames(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2"
            rows={2}
            placeholder="Namen aller Gäste..."
          />
        </div>

        <div className="space-y-2">
          <Label>Ernährungsgewohnheiten</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vegan"
                checked={dietary.vegan}
                onCheckedChange={(checked) =>
                  setDietary({ ...dietary, vegan: checked as boolean })
                }
              />
              <label htmlFor="vegan" className="text-sm">Vegan</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="vegetarian"
                checked={dietary.vegetarian}
                onCheckedChange={(checked) =>
                  setDietary({ ...dietary, vegetarian: checked as boolean })
                }
              />
              <label htmlFor="vegetarian" className="text-sm">Vegetarisch</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="glutenFree"
                checked={dietary.glutenFree}
                onCheckedChange={(checked) =>
                  setDietary({ ...dietary, glutenFree: checked as boolean })
                }
              />
              <label htmlFor="glutenFree" className="text-sm">Glutenfrei</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="lactoseFree"
                checked={dietary.lactoseFree}
                onCheckedChange={(checked) =>
                  setDietary({ ...dietary, lactoseFree: checked as boolean })
                }
              />
              <label htmlFor="lactoseFree" className="text-sm">Laktosefrei</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="none"
                checked={dietary.none}
                onCheckedChange={(checked) =>
                  setDietary({ ...dietary, none: checked as boolean })
                }
              />
              <label htmlFor="none" className="text-sm">Keine besonderen Wünsche</label>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="comments">Kommentare</Label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-1 block w-full rounded-md border border-neutral-200 px-3 py-2"
            rows={3}
            placeholder="Zusätzliche Informationen (z.B. Ankunftszeit)..."
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500">
          <AlertTriangle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-500">
          <CheckCircle2 className="h-4 w-4" />
          <span>{success}</span>
        </div>
      )}

      <Button type="submit" className="w-full">
        Buchung absenden
      </Button>
    </form>
  );
}