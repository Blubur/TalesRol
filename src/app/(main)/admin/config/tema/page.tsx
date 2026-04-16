import { getAllConfig } from '../configactions'
import TemaForm from './TemaForm'

export default async function TemaPage() {
  const config = await getAllConfig()
  return <TemaForm config={config} />
}