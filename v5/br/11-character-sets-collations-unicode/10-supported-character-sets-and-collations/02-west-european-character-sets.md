### 10.10.2 Conjuntos de Caracteres da Europa Ocidental

Os Conjuntos de Caracteres da Europa Ocidental abrangem a maioria dos idiomas da Europa Ocidental, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, faroês, islandês, irlandês, escocês e inglês.

* `ascii` (US ASCII) collations:

  + `ascii_bin`
  + `ascii_general_ci` (default)
* `cp850` (DOS Europa Ocidental) collations:

  + `cp850_bin`
  + `cp850_general_ci` (default)
* `dec8` (DEC Europa Ocidental) collations:

  + `dec8_bin`
  + `dec8_swedish_ci` (default)
* `hp8` (HP Europa Ocidental) collations:

  + `hp8_bin`
  + `hp8_english_ci` (default)
* `latin1` (cp1252 Europa Ocidental) collations:

  + `latin1_bin`
  + `latin1_danish_ci`
  + `latin1_general_ci`
  + `latin1_general_cs`
  + `latin1_german1_ci`
  + `latin1_german2_ci`
  + `latin1_spanish_ci`
  + `latin1_swedish_ci` (default)

  `latin1` é o Character Set padrão. O `latin1` do MySQL é o mesmo que o Character Set `cp1252` do Windows. Isso significa que ele é o mesmo que o `ISO 8859-1` oficial ou `latin1` IANA (Internet Assigned Numbers Authority), exceto que o `latin1` IANA trata os code points entre `0x80` e `0x9f` como “indefinidos”, enquanto o `cp1252`, e consequentemente o `latin1` do MySQL, atribui caracteres para essas posições. Por exemplo, `0x80` é o sinal do Euro. Para as entradas “indefinidas” no `cp1252`, o MySQL traduz `0x81` para Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090` e `0x9d` para `0x009d`.

  A collation `latin1_swedish_ci` é a padrão que provavelmente é usada pela maioria dos clientes MySQL. Embora seja frequentemente dito que ela é baseada nas regras de collation suecas/finlandesas, há suecos e finlandeses que discordam dessa afirmação.

  As collations `latin1_german1_ci` e `latin1_german2_ci` são baseadas nos padrões DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão da ANSI). DIN-1 é chamada de “dictionary collation” (collation de dicionário) e DIN-2 é chamada de “phone book collation” (collation de lista telefônica). Para um exemplo do efeito que isso tem em comparações ou ao realizar buscas, consulte a Seção 10.8.6, “Exemplos do Efeito da Collation”.

  + Regras para `latin1_german1_ci` (dicionário):

    ```sql
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```

  + Regras para `latin1_german2_ci` (lista telefônica):

    ```sql
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

  Na collation `latin1_spanish_ci`, `ñ` (n-til) é uma letra separada, posicionada entre `n` e `o`.

* `macroman` (Mac Europa Ocidental) collations:

  + `macroman_bin`
  + `macroman_general_ci` (default)
* `swe7` (Sueco 7bit) collations:

  + `swe7_bin`
  + `swe7_swedish_ci` (default)