# Overview
The button called z-button is styled button component 

### Task
- create a button similar with shadcn button
- accepted props: 
   - variant: (fill,ghost,outline)
   - theme: (success,danger,primary,mute,secondary)
   - size: (large,icon,small,extra-small)
   - text:string
   - icon:ReactNode
   - button props

### Style
- button should be rounded to small
- should have different size theme and variant


### Note
- use csv
- make sure that this can be used anywhere regardless of react framework 

### Example
```
<ZButton 
   variant={fill} 
   icon={<MailIcon />} 
   text="Submit" />