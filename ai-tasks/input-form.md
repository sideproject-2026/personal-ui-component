### Overiview
an input that is used with the react-hook-form. to bind with react-hook-form

### Task
- create an input component
- bind the react-hook-form using FieldValues
- add a message for error display
- include also an optional icon property icon:ReactNode
- include also alignIcon "left | right"
- include also a label
- include also orientaion "column | row"  this orientation is the orientation of components label and input if column then the div will be flex-col otherwise flex-row
- add baseClassName for div an inputClassName for input a labelClassName for label all optional
- include the size of component "lg | sm | xs"


### Example
``` 
const form = useForm<SchemaType>(
   resolver: zodResolver(schematype),
   default: {
      email: ""
   }
)
<InputForm 
   control={form}
   orientation="column"
   baseClassName="w-full"
   name="email"
   label="Enter email"
   placeholder="Enter email"
   errorMessage="Please Enter email address"
   icon={<MailIcon className="size-4">}
   alignIcon={"left"}
>
```

### UI
- should be rounded sm
- the component should be based on the size example if small then label is `10px` input font-size `12px`