import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { computeBalance, toNumber } from './money'

const recordsCol = () => collection(db, 'records')

export function normalizeRecord(data) {
  const totalAmount = toNumber(data.totalAmount)
  const deposit = toNumber(data.deposit)
  const balance = computeBalance(totalAmount, deposit)

  return {
    serialNo: String(data.serialNo || '').trim(),
    name: String(data.name || '').trim(),
    phoneNumber: String(data.phoneNumber || '').trim(),
    dateIn: data.dateIn || '',
    dateOut: data.dateOut || '',
    totalAmount,
    isPaid: Boolean(data.isPaid) || balance <= 0,
    balance,
    deposit,
  }
}

export function nextSerialNo(records) {
  const max = records.reduce((acc, row) => {
    const n = Number(row.serialNo)
    return Number.isFinite(n) ? Math.max(acc, n) : acc
  }, 0)
  return String(max + 1).padStart(3, '0')
}

export function subscribeRecords(onChange, onError) {
  return onSnapshot(
    recordsCol(),
    (snap) => {
      const rows = snap.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((a, b) => String(b.serialNo).localeCompare(String(a.serialNo), undefined, { numeric: true }))
      onChange(rows)
    },
    onError,
  )
}

export async function createRecord(input) {
  const payload = normalizeRecord(input)
  await addDoc(recordsCol(), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function saveRecord(id, input) {
  const payload = normalizeRecord(input)
  await updateDoc(doc(db, 'records', id), {
    ...payload,
    updatedAt: serverTimestamp(),
  })
}

export async function removeRecord(id) {
  await deleteDoc(doc(db, 'records', id))
}
