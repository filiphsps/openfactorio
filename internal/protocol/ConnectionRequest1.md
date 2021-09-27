# ConnectionRequest1

| Size    | Type   | Description                |
| ------- | ------ | -------------------------- |
| 2 bytes | ???    | Seems to always be `00 00` |
| 3 bytes | Triad  | The game version           |
| 2 bytes | LShort | Build number               |
| 4 bytes | LInt   | Random ID                  |

```javascript
/*
# Case 1:
22 00   00 01   01 27
39 e6   44 2f   9e 15

# Case 2:
02 00   00 01   01 27
39 e6   5e 1e   11 35

# Case 3:
22 00   00 01   01 27
39 e6   66 52   aa 1b
*/
```
