# Commands
The following is a table for all of the supported commands and the MIDI code associated with them. I created this in [a Google Sheet](https://docs.google.com/spreadsheets/d/1576S5DrqOGipAHgLNGmzOry-D0HBTw4PIkt-bWWTIUU/) and also copied most of the formatting to this markdown table.


---


|                               | Launchpad Mini                           | Launchpad MK2                                                                              | Launchpad Pro                                                                              | Evaluation  | RGB Evaluation |
|-------------------------------|------------------------------------------|--------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|-------------|----------------|
| **Values**                    |                                          |                                                                                            |                                                                                            |             |                |
| Manufacturer ID               | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *0, 32, 41*                                                                                | *0, 32, 41*                                                                                | *Different* | *Same*         |
| Model ID                      | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *2, 24*                                                                                    | *2, 16*                                                                                    | *Different* | *Different*    |
| **Computer to Launchpad**     |                                          |                                                                                            |                                                                                            |             |                |
| Set LED Standard              | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               | *Status (Channel 1), LED, Color*         | *Status (Channel 1), LED, Color*                                                           | *Status (Channel 1), LED, Color*                                                           | *Same*      | *Same*         |
|                               |                                          | *240, Manufacturer ID, Model ID, 10, LED, Color, 247*                                      | *240, Manufacturer ID, Model ID, 10, LED, Color, 247*                                      | *Different* | *Same*         |
| Set LED Off                   | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               | *128, LED, Ignored*                      | *128, LED, Ignored*                                                                        | *128, LED, Ignored*                                                                        | *Same*      | *Same*         |
|                               | *Set LED Standard: (LED, 12)*            | *Set LED Standard: (LED, 0)*                                                               | *Set LED Standard: (LED, 0)*                                                               | *Different* | *Same*         |
| Set LED RGB                   | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, Model ID, 11, LED, Red, Green, Blue, 247*                           | *240, Manufacturer ID, Model ID, 11, LED, Red, Green, Blue, 247*                           | *Different* | *Same*         |
| Set LED RGB Grid              | No                                       | No (Use SysEx Repeating)                                                                   | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *240, Manufacturer ID, Model ID, 15, Grid Type, Red, Green, Blue, 247*                     | *Different* | *Different*    |
| Set LED Column                | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, Model ID, 12, Column, Color, 247*                                   | *240, Manufacturer ID, Model ID, 12, Column, Color, 247*                                   | *Different* | *Same*         |
| Set LED Row                   | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, Model ID, 13, Row, Color, 247*                                      | *240, Manufacturer ID, Model ID, 13, Row, Color, 247*                                      | *Different* | *Same*         |
| Set LED All                   | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               | *176, 0, Brightness*                     | *240, Manufacturer ID, Model ID, 14, Color, 247*                                           | *240, Manufacturer ID, Model ID, 14, Color, 247*                                           | *Different* | *Same*         |
| Set LED Rapid                 | Yes                                      | No (Use SysEx)                                                                             | No (Use SysEx)                                                                             | Varies      | Not Supported  |
|                               | *146, Velocity, Velocity... - Channel 3* |                                                                                            |                                                                                            | *Different* | *Same*         |
| Flash LED                     | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               |                                          | *Status (Channel 2), LED, Color*                                                           | *Status (Channel 2), LED, Color*                                                           | *Different* | *Same*         |
|                               | *144, LED, Velocity*                     | *240, Manufacturer ID, Model ID, 35, 0, LED, Color, 247*                                   | *240, Manufacturer ID, Model ID, 35, 0, LED, Color, 247*                                   | *Different* | *Same*         |
| Pulse LED                     | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *Status (Channel 3), LED, Color*                                                           | *Status (Channel 3), LED, Color*                                                           | *Different* | *Same*         |
|                               |                                          | *240, Manufacturer ID, Model ID, 40, 0, LED, Color, 247*                                   | *240, Manufacturer ID, Model ID, 40, 0, LED, Color, 247*                                   | *Different* | *Same*         |
| Marquee                       | Unknown                                  | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, Model ID, 20, Color, Loop, Text, 247*                               | *240, Manufacturer ID, Model ID, 20, Color, Loop, Text, 247*                               | *Different* | *Same*         |
| MIDI Clock                    | Unknown                                  | Yes (40-240 BPM, 24 per beat)                                                              | Yes (40-240 BPM, 24 per beat)                                                              | Varies      | Supported      |
|                               |                                          | *248*                                                                                      | *248*                                                                                      | *Different* | *Same*         |
| Layout Selection (Live)       | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               | *176, 0, Layout*                         | *240, Manufacturer ID, Model ID, 34, Layout, 247*                                          | *240, Manufacturer ID, Model ID, 34, Layout, 247*                                          | *Different* | *Same*         |
| Layout Selection (Standalone) | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *240, Manufacturer ID, Model ID, 44, Layout,  247*                                         | *Different* | *Different*    |
| Mode Selection                | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *240, Manufacturer ID, Model ID, 33, Mode, 247*                                            | *Different* | *Different*    |
| Mode Status                   | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *240, Manufacturer ID, Model ID, 45, Mode, 247*                                            | *Different* | *Different*    |
| Live Layout Status            | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *240, Manufacturer ID, Model ID, 46, Layout, 247*                                          | *Different* | *Different*    |
| Standalone Layout Status      | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *240, Manufacturer ID, Model ID, 47, Layout, 247*                                          | *Different* | *Different*    |
| Fader Setup                   | Unknown                                  | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, Model ID, 43, Number, Type, Color, Value, 247*                      | *240, Manufacturer ID, Model ID, 43, Number, Type, Color, Value, 247*                      | *Different* | *Same*         |
| Device Inquiry                | Unknown                                  | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, 126, Device ID or 127, 6, 1, 247*                                                    | *240, 126, Device ID? or 127, 6, 1, 247*                                                   | *Different* | *Different*    |
| Version Inquiry               | Unknown                                  | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, 0, 112, 247*                                                        | *240, Manufacturer ID, 0, 112, 247*                                                        | *Different* | *Same*         |
| Set to Bootloader             | Unknown                                  | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, 0, 113, 0, 105, 247*                                                | *240, Manufacturer ID, 0, 113, 0, 105, 247*                                                | *Different* | *Same*         |
| Control Double Buffering      | Yes                                      | No (Use SysEx)                                                                             | No (Use SysEx)                                                                             | Varies      | Not Supported  |
|                               | *176, 0, Data*                           |                                                                                            |                                                                                            | *Different* | *Same*         |
| Set Duty Cycle                | Yes                                      | No (Use RGB)                                                                               | No (Use RGB)                                                                               | Varies      | Not Supported  |
|                               | *176, 30-31, Data*                       |                                                                                            |                                                                                            | *Different* | *Same*         |
| Reset                         | Yes (LEDs, Layout, Duty Cycle)           | No (Can be shimmed)                                                                        | No (Can be shimmed)                                                                        | Varies      | Not Supported  |
|                               | *176, 0, 0*                              |                                                                                            |                                                                                            | *Different* | *Same*         |
| **Launchpad to Computer**     |                                          |                                                                                            |                                                                                            |             |                |
| Press                         | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               | *Status, Key, 127*                       | *Status, Key, 127*                                                                         | *Status, Key, (127 or Pressure)*                                                           | *Different* | *Different*    |
| Release                       | Yes                                      | Yes                                                                                        | Yes                                                                                        | Supported   | Supported      |
|                               | *Status Key, 0*                          | *Status, Key, 0*                                                                           | *Status, Key, 0*                                                                           | *Different* | *Same*         |
| Device Inquiry Response       | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, 126, Device ID, 6, 2, Manufacturer ID, Device Information, Firmware Version, 247*    | *240, 126, Device ID, 6, 2, Manufacturer ID, Device Information, Firmware Version, 247*    | *Different* | *Same*         |
| Version Inquiry Response      | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, 0, 112, Bootloader Version, Firmware Version, Bootloader Size, 247* | *240, Manufacturer ID, 0, 112, Bootloader Version, Firmware Version, Bootloader Size, 247* | *Different* | *Same*         |
| Marquee                       | No                                       | Yes                                                                                        | Yes                                                                                        | Varies      | Supported      |
|                               |                                          | *240, Manufacturer ID, Model ID, 21, 247*                                                  | *240, Manufacturer ID, Model ID, 21, 247*                                                  | *Different* | *Same*         |
| Mode Response                 | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *Unknown*                                                                                  | *Different* | *Different*    |
| Live Layout Response          | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *Unknown*                                                                                  | *Different* | *Different*    |
| Standalone Layout Response    | No                                       | No                                                                                         | Yes                                                                                        | Varies      | Varies         |
|                               |                                          |                                                                                            | *Unknown*                                                                                  | *Different* | *Different*    |
| **Layouts**                   |                                          |                                                                                            |                                                                                            |             |                |
| Live                          |                                          |                                                                                            |                                                                                            |             |                |
|                               | *01 - X-Y (Session)*                     | *00 - Session*                                                                             | *00 - Session*                                                                             |             |                |
|                               | *02 - Drum Rack*                         | *01 - User 1 (Drum Rack)*                                                                  | *01 - Drum Rack*                                                                           |             |                |
|                               |                                          | *02 - User 2*                                                                              | *02 - Chromatic Note*                                                                      |             |                |
|                               |                                          | *03 - Reserved (Ableton)*                                                                  | *03 - User (Drum)*                                                                         |             |                |
|                               |                                          | *04 - Fader*                                                                               | *04 - Audio (Blank)*                                                                       |             |                |
|                               |                                          | *05 - Pan*                                                                                 | *05 - Fader*                                                                               |             |                |
|                               |                                          |                                                                                            | *06 - Record Arm (Session)*                                                                |             |                |
|                               |                                          |                                                                                            | *07 - Track Select (Session)*                                                              |             |                |
|                               |                                          |                                                                                            | *08 - Mute (Session)*                                                                      |             |                |
|                               |                                          |                                                                                            | *09 - Solo (Session)*                                                                      |             |                |
|                               |                                          |                                                                                            | *10 - Volume (Fader)*                                                                      |             |                |
| Standalone                    |                                          |                                                                                            |                                                                                            |             |                |
|                               |                                          |                                                                                            | *00 - Note*                                                                                |             |                |
|                               |                                          |                                                                                            | *01 - Drum*                                                                                |             |                |
|                               |                                          |                                                                                            | *02 - Fader*                                                                               |             |                |
|                               |                                          |                                                                                            | *03 - Programmer*                                                                          |             |                |