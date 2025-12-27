### 12.10.2 Conjuntos de Caracteres da Europa Ocidental

Os conjuntos de caracteres da Europa Ocidental abrangem a maioria das línguas da Europa Ocidental, como francês, espanhol, catalão, basco, português, italiano, albanês, holandês, alemão, dinamarquês, sueco, norueguês, finlandês, feroês, islandês, irlandês, escocês e inglês.

* Coligações de caracteres `ascii` (ASCII dos EUA):

  + `ascii_bin`
  + `ascii_general_ci` (padrão)
* Coligações de caracteres `cp850` (Europa Ocidental do DOS):

  + `cp850_bin`
  + `cp850_general_ci` (padrão)
* Coligações de caracteres `dec8` (Europa Ocidental da DEC):

  + `dec8_bin`
  + `dec8_swedish_ci` (padrão)

O conjunto de caracteres `dec` está desatualizado; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.
* Coligações de caracteres `hp8` (Europa Ocidental da HP):

  + `hp8_bin`
  + `hp8_english_ci` (padrão)

O conjunto de caracteres `hp8` está desatualizado; espere que o suporte a ele seja removido em uma versão subsequente do MySQL.
* Coligações de caracteres `latin1` (cp1252 da Europa Ocidental):

  + `latin1_bin`
  + `latin1_danish_ci`
  + `latin1_general_ci`
  + `latin1_general_cs`
  + `latin1_german1_ci`
  + `latin1_german2_ci`
  + `latin1_spanish_ci`
  + `latin1_swedish_ci` (padrão)

O `latin1` do MySQL é o mesmo que o conjunto de caracteres `cp1252` do Windows. Isso significa que é o mesmo que o `ISO 8859-1` oficial ou o `latin1` da IANA (Autoridade de Numeração Atribuída na Internet), exceto que o `latin1` da IANA trata os pontos de código entre `0x80` e `0x9f` como "definidos", enquanto o `cp1252`, e, portanto, o `latin1` do MySQL, atribuem caracteres para essas posições. Por exemplo, `0x80` é o símbolo do Euro. Para as entradas "definidas" no `cp1252`, o MySQL traduz `0x81` para o Unicode `0x0081`, `0x8d` para `0x008d`, `0x8f` para `0x008f`, `0x90` para `0x0090` e `0x9d` para `0x009d`.

A coligação `latin1_swedish_ci` é a padrão que provavelmente é usada pela maioria dos clientes do MySQL. Embora seja frequentemente dito que ela é baseada nas regras de coligação sueco/finlandês, há suecas e finlandeses que discordam dessa afirmação.

As colorações `latin1_german1_ci` e `latin1_german2_ci` são baseadas nas normas DIN-1 e DIN-2, onde DIN significa *Deutsches Institut für Normung* (o equivalente alemão da ANSI). DIN-1 é chamada de "coloração de dicionário" e DIN-2 é chamada de "coloração de catálogo telefônico". Para um exemplo do efeito que isso tem em comparações ou ao fazer buscas, veja a Seção 12.8.6, "Exemplos do Efeito da Coloração".

+ Coloração `latin1_german1_ci` (dicionário):

    ```
    Ä = A
    Ö = O
    Ü = U
    ß = s
    ```
+ Coloração `latin1_german2_ci` (catálogo telefônico):

    ```
    Ä = AE
    Ö = OE
    Ü = UE
    ß = ss
    ```

Na coloração `latin1_spanish_ci`, `ñ` (n-tilde) é uma letra separada entre `n` e `o`.
* Colorações `macroman` (Mac West European):

    + `macroman_bin`
    + `macroman_general_ci` (padrão)

`macroroman` é desatualizado; espere o suporte para ele ser removido em uma versão subsequente do MySQL.
* Colorações `swe7` (sueco de 7 bits):

    + `swe7_bin`
    + `swe7_swedish_ci` (padrão)