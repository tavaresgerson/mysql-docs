### 10.10.2 Character Sets da Europa Ocidental

Os Character Sets da Europa Ocidental cobrem a maioria das línguas da Europa Ocidental, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, feroês, islandês, irlandês, escocês e inglês.

* `Collation`s `ascii` (US ASCII):

  + `ascii_bin`
  + `ascii_general_ci` (padrão)
* `Collation`s `cp850` (DOS Europa Ocidental):

  + `cp850_bin`
  + `cp850_general_ci` (padrão)
* `Collation`s `dec8` (DEC Europa Ocidental):

  + `dec8_bin`
  + `dec8_swedish_ci` (padrão)
* `Collation`s `hp8` (HP Europa Ocidental):

  + `hp8_bin`
  + `hp8_english_ci` (padrão)
* `Collation`s `latin1` (cp1252 Europa Ocidental):

  + `latin1_bin`
  + `latin1_danish_ci`
  + `latin1_general_ci`
  + `latin1_general_cs`
  + `latin1_german1_ci`
  + `latin1_german2_ci`
  + `latin1_spanish_ci`
  + `latin1_swedish_ci` (padrão)

O `latin1` é o Character Set padrão. O `latin1` do MySQL é o mesmo que o Character Set `cp1252` do Windows. Isso significa que ele é o mesmo que o `ISO 8859-1` oficial ou IANA (Internet Assigned Numbers Authority) `latin1`, exceto que o IANA `latin1` trata os Code Points entre `0x80` e `0x9f` como “indefinidos”, enquanto o `cp1252`, e consequentemente o `latin1` do MySQL, atribui caracteres a essas posições. Por exemplo, `0x80` é o sinal do Euro. Para as entradas “indefinidas” no `cp1252`, o MySQL traduz `0x81` para o Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090`, e `0x9d` para `0x009d`.

A Collation `latin1_swedish_ci` é o padrão que provavelmente é usado pela maioria dos clientes MySQL. Embora seja frequentemente dito que ela se baseia nas regras de Collation suecas/finlandesas, há suecos e finlandeses que discordam dessa afirmação.

As Collation`s `latin1_german1_ci` e `latin1_german2_ci` são baseadas nos padrões DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão da ANSI). DIN-1 é chamada de “dictionary collation” (Collation de dicionário) e DIN-2 é chamada de “phone book collation” (Collation de lista telefônica). Para um exemplo do efeito que isso tem em comparações ou ao realizar buscas, veja Seção 10.8.6, “Exemplos do Efeito da Collation”.

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

Na Collation `latin1_spanish_ci`, o caractere `ñ` (n-til) é uma letra separada entre `n` e `o`.

* `Collation`s `macroman` (Mac Europa Ocidental):

  + `macroman_bin`
  + `macroman_general_ci` (padrão)
* `Collation`s `swe7` (Sueco 7bit):

  + `swe7_bin`
  + `swe7_swedish_ci` (padrão)