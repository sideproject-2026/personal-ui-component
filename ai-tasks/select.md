# Overview
The button called z-select is a customize html select component

### Task
- create a select provider that handles the value and onchange value
- create a select trigger that trigger when the whole select click
- create a select value that display the value
- create a select content that serve container of the select
- create a selectItem which will be the `<option>`
- this component is similar to Shadcn Select
- 
- accepted props: 
   - items: SelectItem[] an optional array that can be pass over provider
   - value: string | undefined
   - onValueChange?(value: string): void
   - className: string | undefined

### Style
- should follow shadcn design on Select

### Note
- make sure that this will be similar to shadcn Select with some improvise properties

### Example
```
<Select
              value={String(pageSize)}
              onValueChange={(value) => onPageSizeChange?.(Number(value))}
            >
              <SelectTrigger className="w-[96px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option} value={String(option)}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
```