const API_BASE_URL = 'http://localhost:3000'
import axios from 'axios'
function generateRandomReservation(espacioId, clientId, baseDate = new Date()) {
  // Generate random date within the next 30 days
  const daysFromNow = Math.floor(Math.random() * 30)
  const reservationDate = new Date(baseDate)
  reservationDate.setDate(reservationDate.getDate() + daysFromNow)

  // Format date as YYYY-MM-DD
  const formattedDate = reservationDate.toISOString().split('T')[0]

  // Generate random start time between 08:00 and 18:00
  const startHour = 8 + Math.floor(Math.random() * 10) // 8-17
  const startMinute = Math.random() > 0.5 ? '00' : '30'
  const startTime = `${startHour.toString().padStart(2, '0')}:${startMinute}`

  // Generate random duration (1-3 hours in 30-min increments)
  const durationSlots = Math.floor(Math.random() * 4) + 2 // 2-5 slots (1-2.5 hours)
  const endHour = startHour + Math.floor(durationSlots / 2)
  const endMinute = durationSlots % 2 === 0 ? startMinute : startMinute === '00' ? '30' : '00'
  const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute}`

  // Random status (mostly confirmed, some pending)
  const status = Math.random() > 0.2 ? 'confirmed' : 'pending'

  return {
    espacioId,
    clientId,
    reservationDate: formattedDate,
    startTime,
    endTime,
    status
  }
}
async function createReservation(reservationData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/reservas`, reservationData, {
      headers: {
        'x-api-key': 'my-secret-api-key'
      }
    })
    return response.data
  } catch (error) {
    console.error('Error creating reservation:', error.response?.data || error.message)
    return null
  }
}

async function createRandomReservas(espacioId, clientId, count = 10, delayMs = 100) {
  console.log(`🎯 Creando ${count} reservas aleatorias...`)
  console.log(`📍 Espacio: ${espacioId}`)
  console.log(`👤 Cliente: ${clientId}`)
  console.log('⏳ Por favor espere...\n')

  const successfulReservations = []
  const failedReservations = []

  for (let i = 1; i <= count; i++) {
    const reservationData = generateRandomReservation(espacioId, clientId)

    console.log(`📝 Creando reserva ${i}/${count}:`)
    console.log(`   Fecha: ${reservationData.reservationDate}`)
    console.log(`   Horario: ${reservationData.startTime} - ${reservationData.endTime}`)
    console.log(`   Estado: ${reservationData.status}`)

    const result = await createReservation(reservationData)

    if (result) {
      successfulReservations.push(result)
      console.log('   ✅ Éxito\n')
    } else {
      failedReservations.push(reservationData)
      console.log('   ❌ Falló\n')
    }

    // Add delay to avoid overwhelming the server
    if (i < count) {
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }
  }

  // Summary
  console.log('📊 RESUMEN DE CREACIÓN:')
  console.log(`✅ Reservas exitosas: ${successfulReservations.length}`)
  console.log(`❌ Reservas fallidas: ${failedReservations.length}`)
  console.log(`📅 Total intentadas: ${count}`)

  return {
    successful: successfulReservations,
    failed: failedReservations
  }
}

function generateBusinessHoursReservation(espacioId, clientId, baseDate = new Date()) {
  const daysFromNow = Math.floor(Math.random() * 60) // Next 60 days
  const reservationDate = new Date(baseDate)
  reservationDate.setDate(reservationDate.getDate() + daysFromNow)

  // Skip weekends (optional)
  if (reservationDate.getDay() === 0 || reservationDate.getDay() === 6) {
    reservationDate.setDate(reservationDate.getDate() + 2) // Move to Monday
  }

  const formattedDate = reservationDate.toISOString().split('T')[0]

  // Business hours: 8:00 AM to 6:00 PM
  const timeSlots = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30'
  ]

  const startIndex = Math.floor(Math.random() * (timeSlots.length - 2)) // Leave room for duration
  const startTime = timeSlots[startIndex]

  // Duration: 1-3 time slots (30 min to 1.5 hours)
  const duration = Math.floor(Math.random() * 3) + 1
  const endTime = timeSlots[startIndex + duration]

  const status = Math.random() > 0.15 ? 'confirmed' : 'pending'

  return {
    espacioId,
    clientId,
    reservationDate: formattedDate,
    startTime,
    endTime,
    status
  }
}

async function createSmartRandomReservas(espacioId, clientId, count = 10) {
  console.log(`🧠 Creando ${count} reservas inteligentes...`)

  const reservations = []
  const createdDates = new Set()

  for (let i = 0; i < count; i++) {
    let attempts = 0
    let reservationData

    // Try to generate a unique date to avoid same-day conflicts
    do {
      reservationData = generateBusinessHoursReservation(espacioId, clientId)
      attempts++
    } while (createdDates.has(reservationData.reservationDate) && attempts < 10)

    createdDates.add(reservationData.reservationDate)

    const result = await createReservation(reservationData)
    if (result) {
      reservations.push(result)
      console.log(
        `✅ Reserva ${i + 1}: ${reservationData.reservationDate} ${reservationData.startTime}-${
          reservationData.endTime
        }`
      )
    } else {
      console.log(`❌ Falló reserva ${i + 1}`)
    }

    await new Promise((resolve) => setTimeout(resolve, 200))
  }

  return reservations
}

createSmartRandomReservas('cmfzlj9g2001yvvvsqxldqork', 'cmfzljnda001zvvvsd2ver5in', 100)
