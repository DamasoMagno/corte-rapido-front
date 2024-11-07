import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Calendar } from "./components/ui/calendar"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { RadioGroup, RadioGroupItem } from "./components/ui/radio-group"
import { Button } from "./components/ui/button"
import { Loader2 } from "lucide-react"
import { api } from "./services/api"
import { toast } from "sonner"
import { Toaster } from "./components/ui/sonner"
import InputMask from 'react-input-mask';

interface Appointment {
  clientName: string
  clientPhone: string
  scheduleId: string
  hairStyleId: string
}

interface Time {
  id: string
  isAvailable: boolean
  time: string
}

interface HairStyle {
  id: string,
  name: string,
  price: number,
  created_at: Date
}

function App() {
  const [appointment, setAppointment] = useState<Appointment>({
    clientName: "",
    clientPhone: "",
    hairStyleId: "",
    scheduleId: ""
  })

  const [date, setDate] = useState<Date | undefined>(new Date())
  const [times, setTimes] = useState<Time[]>([])
  const [hairs, setHairs] = useState<HairStyle[]>([])
  const [loading, setLoading] = useState(false)

  function handleSetAppointmentAttribute(e: ChangeEvent<HTMLInputElement>) {
    setAppointment(prev => {
      return {
        ...prev,
        [e.target.name]: e.target.value
      }
    })
  }

  const formattedDate = date?.toISOString().split("T")[0]; // "2024-11-13"

  useEffect(() => {
    async function getSchedules() {
      try {
        const response = await api.get(`https://corte-rapido-api.onrender.com/schedule/available?day=${formattedDate}`)
        setTimes(response.data[0].times ?? [])
      } catch (error) {
        console.log(error)
      }
    }

    getSchedules()
  }, [formattedDate])

  useEffect(() => {
    async function getHairsStyle() {
      try {
        const response = await api.get(`https://corte-rapido-api.onrender.com/hair-style`)
        setHairs(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    getHairsStyle()
  }, [])

  async function handleCreateAppointment(e: FormEvent) {
    e.preventDefault();

    try {
      setLoading(true)
      await api.post(`/appointment`, appointment)
      setTimes(prev => prev.map(time => {
        return time.id === appointment.scheduleId ? {
          ...time,
          isAvailable: false
        } : time
      }))

      toast.success("Agendamento realizado com sucesso!")
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center px-4 mb-4">
        <h3 className="text-xl font-bold mb-6 mt-4">Realizar Agendamento</h3>

        <form className="max-w-72 w-full flex flex-col gap-4" onSubmit={handleCreateAppointment}>
          <div>
            <Label>Nome</Label>
            <Input
              name="clientName"
              onChange={handleSetAppointmentAttribute}
            />
          </div>
          <div>
            <Label>Telefone</Label>
            <InputMask
              name="clientPhone"
              mask="(99) 99999-9999"
              alwaysShowMask={false}
              onChange={handleSetAppointmentAttribute}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div>
            <Label>Selecionar dia</Label>
            <Calendar
              mode="single"
              className="rounded-md border flex justify-center items-center"
              onSelect={setDate}
              selected={date}
            />

            <div className="flex flex-col mt-4">
              <span className="text-xs text-gray-500">Horários</span>
              <RadioGroup
                onValueChange={event => setAppointment(prev => {
                  return {
                    ...prev,
                    scheduleId: event
                  }
                })}
                className="flex flex-col mt-2"
              >
                {times.map(time => (
                  <div
                    key={time.id}
                    className={`flex items-center space-x-2 border border-1 rounded-lg p-2  ${time.isAvailable ? "opacity-100" : "opacity-45"}`}
                  >
                    <RadioGroupItem value={time.id} id={time.id} disabled={!time.isAvailable} />
                    <Label
                      className={`${time.isAvailable ? "opacity-100" : "opacity-70"}`}
                      htmlFor={time.id}
                    >
                      {time.time}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-500">Corte de Cabelo</span>
            <RadioGroup
              onValueChange={event => {
                setAppointment(prev => {
                  return {
                    ...prev,
                    hairStyleId: event
                  }
                })
              }
              }
              className="mt-2"
            >
              {hairs?.map((hair) => (
                <div
                  key={hair.id}
                  className="flex items-center space-x-2 border border-1 rounded p-4 cursor-pointer">
                  <RadioGroupItem
                    value={hair.id}
                    id={hair.name}
                  />
                  <Label htmlFor={hair.name} className="flex justify-between items-center w-full">
                    <span className="font-medium">{hair.name}</span>
                    <span className="font-normal">{new Intl.NumberFormat("pt-Br", {
                      style: "currency",
                      currency: "BRL"
                    }).format(hair.price)}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <Button
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Agendar"}
          </Button>
        </form>
      </div>
      <Toaster />
    </>
  )
}

export default App
