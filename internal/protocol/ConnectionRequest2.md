# ConnectionRequest2

## Notes

| Size    | Type   | Description |
| ------- | ------ | ----------- |
| 2 bytes | ???    | ???         |
| 4 bytes | LInt   | Random ID   |
| 4 bytes | LInt   | Random ID 2 |
| 4 bytes | ???    | ???         |
| ? bytes | String | Player name |
| 3 bytes | ???    | `00 00 00`  |
| 9 bytes | ???    | ???         |
| 5 bytes | String | `base`      |
| 8 bytes | ???    | ???         |

```javascript
/*
# Case 1:
04 01   00 c8   88 3b
bb b7   4f f0   91 4c   c3 7e   a2 0f   46 69   6c 69   70 68
73 61   6e 64   73 74   72 6f   6d 00   00 00   95 49   ca 95
33 4b   e4 b4   01 04   62 61   73 65   01 01   27 f3   09 8a
74 00

# Case 2:
04 01   00 b0   73 3d
b4 01   d2 83   30 e2   3e c0   c0 0f   46 69   6c 69   70 68
73 61   6e 64   73 74   72 6f   6d 00   00 00   95 49   ca 95
33 4b   e4 b4   01 04   62 61   73 65   01 01   27 f3   09 8a
74 00
*/
```
