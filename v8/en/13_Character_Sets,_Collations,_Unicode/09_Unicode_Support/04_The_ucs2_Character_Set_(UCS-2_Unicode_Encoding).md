### 12.9.4 The ucs2 Character Set (UCS-2 Unicode Encoding)

Note

The `ucs2` character set is deprecated in MySQL 8.0.28; expect it to be removed in a future MySQL release. Please use `utf8mb4` instead.

In UCS-2, every character is represented by a 2-byte Unicode code with the most significant byte first. For example: `LATIN CAPITAL LETTER A` has the code `0x0041` and it is stored as a 2-byte sequence: `0x00 0x41`. `CYRILLIC SMALL LETTER YERU` (Unicode `0x044B`) is stored as a 2-byte sequence: `0x04 0x4B`. For Unicode characters and their codes, please refer to the Unicode Consortium website.

The `ucs2` character set has these characteristics:

* Supports BMP characters only (no support for supplementary characters)

* Uses a fixed-length 16-bit encoding and requires two bytes per character.
