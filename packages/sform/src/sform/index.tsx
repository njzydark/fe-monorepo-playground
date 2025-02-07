import { Input } from '@arco-design/web-react'
import { createForm, DataField, onFieldReact } from '@formily/core'
import { Field, FormProvider } from '@formily/react'
import { useMemo } from 'react'

export const SForm = () => {
  const form = useMemo(() => {
    return createForm({
      effects() {
        onFieldReact('a', (field) => {
          const aField = field as unknown as DataField
          const bField = field.query('b').take() as DataField

          if (!bField?.value) {
            return
          }

          aField.value = bField.value

          // console.log('change', aField.value)
        })
      },
    })
  }, [])

  return (
    <FormProvider form={form}>
      <Field name="a" component={[Input]} />
      <Field name="b" component={[Input]} />
    </FormProvider>
  )
}
