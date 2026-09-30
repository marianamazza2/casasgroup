// Envío de formularios vía Formspree (AJAX). Los IDs no son secretos: cualquier
// endpoint de Formspree acaba visible en el HTML/JS del cliente, así que van
// aquí en vez de en variables de entorno. Para limitar el abuso, restringir los
// dominios permitidos en Settings de cada formulario en formspree.io.
export const FORMSPREE_FORMS = {
  contacto: 'mbglwbyd',
  vender: 'mjyklzrw',
} as const

// Envía el <form> tal cual (todos los campos con `name`) más los extras
// (_subject, etc.). Lanza si Formspree no confirma la recepción.
export async function submitToFormspree(
  formId: string,
  form: HTMLFormElement,
  extra: Record<string, string> = {},
) {
  const data = new FormData(form)
  for (const [key, value] of Object.entries(extra)) data.set(key, value)

  const res = await fetch(`https://formspree.io/f/${formId}`, {
    method: 'POST',
    body: data,
    headers: { Accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`Formspree ${res.status}`)
}
