### 10.10.1 Conjuntos de Caracteres do Ocidente Europeu

Os conjuntos de caracteres da Europa Ocidental cobrem a maioria das línguas da Europa Ocidental, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, feroês, islandês, irlandês, escocês e inglês.

- Colagens `ascii` (ASCII dos EUA):

  - `ascii_bin`
  - `ascii_general_ci` (padrão)

- Colagens `cp850` (DOS da Europa Ocidental):

  - `cp850_bin`
  - `cp850_general_ci` (padrão)

- `dec8` (colagens do oeste da Europa)

  - `dec8_bin`
  - `dec8_swedish_ci` (padrão)

- Colagens `hp8` (HP da Europa Ocidental):

  - `hp8_bin`
  - `hp8_english_ci` (padrão)

- Colagens `latin1` (cp1252 da Europa Ocidental):

  - `latin1_bin`
  - `latin1_danish_ci`
  - `latin1_general_ci`
  - `latin1_general_cs`
  - `latin1_german1_ci`
  - `latin1_german2_ci`
  - `latin1_spanish_ci`
  - `latin1_swedish_ci` (padrão)

  `latin1` é o conjunto de caracteres padrão. O `latin1` do MySQL é o mesmo que o conjunto de caracteres `cp1252` do Windows. Isso significa que é o mesmo que o `ISO 8859-1` oficial ou o `latin1` da IANA (Autoridade de Números Atribuídos na Internet), exceto que o `latin1` da IANA trata os pontos de código entre `0x80` e `0x9f` como “definidos”, enquanto o `cp1252`, e, portanto, o `latin1` do MySQL, atribuem caracteres para essas posições. Por exemplo, `0x80` é o símbolo do Euro. Para as entradas “definidas” no `cp1252`, o MySQL traduz `0x81` para o Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090` e `0x9d` para `0x009d`.

  A combinação de ordenação `latin1_swedish_ci` é a padrão que provavelmente é usada pela maioria dos clientes do MySQL. Embora seja frequentemente dito que ela é baseada nas regras de combinação de ordenação sueco/finlandês, há suecas e finlandeses que discordam dessa afirmação.

  As collation `latin1_german1_ci` e `latin1_german2_ci` são baseadas nas normas DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão da ANSI). A DIN-1 é chamada de "collation de dicionário" e a DIN-2 é chamada de "collation de catálogo telefônico". Para um exemplo do efeito que isso tem em comparações ou durante pesquisas, consulte a Seção 10.8.6, "Exemplos do Efeito da Collation".

  - Regras `latin1_german1_ci` (dicionário):

    ```sql
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```

  - Regras `latin1_german2_ci` (dicionário telefônico):

    ```sql
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

  Na combinação de ordenação `latin1_spanish_ci`, `ñ` (n-tilde) é uma letra separada entre `n` e `o`.

- Colagens `macroman` (Mac Oeste Europeu):

  - `macroman_bin`
  - `macroman_general_ci` (padrão)

- `swe7` (coleções suecas de 7 bits):

  - `swe7_bin`
  - `swe7_swedish_ci` (padrão)
