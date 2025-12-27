### 14.24.2 Características do Tipo de Dados DECIMAL

Esta seção discute as características do tipo de dados `DECIMAL` - DECIMAL, NUMERIC") (e seus sinônimos), com especial atenção aos seguintes tópicos:

* Número máximo de dígitos
* Formato de armazenamento
* Requisitos de armazenamento
* A extensão não padrão do MySQL para o intervalo superior das colunas `DECIMAL` - DECIMAL, NUMERIC")

A sintaxe de declaração para uma coluna `DECIMAL` - DECIMAL, NUMERIC") é `DECIMAL(M,D)`. As faixas de valores para os argumentos são as seguintes:

* *`M`* é o número máximo de dígitos (a precisão). Tem um intervalo de 1 a 65.
* *`D`* é o número de dígitos à direita do ponto decimal (a escala). Tem um intervalo de 0 a 30 e não deve ser maior que *`M`*.

Se *`D`* for omitido, o padrão é 0. Se *`M`* for omitido, o padrão é 10.

O valor máximo de 65 para *`M`* significa que os cálculos nos valores de `DECIMAL` - DECIMAL, NUMERIC") são precisos até 65 dígitos. Esse limite de 65 dígitos de precisão também se aplica a literais numéricos de valor exato, então a faixa máxima desses literais difere da anterior. (Há também um limite sobre o comprimento do texto dos literais `DECIMAL` - DECIMAL, NUMERIC") que podem ter; veja a Seção 14.24.3, “Tratamento de Expressões.”)

Os valores das colunas `DECIMAL` - DECIMAL, NUMERIC") são armazenados usando um formato binário que compacta nove dígitos decimais em 4 bytes. Os requisitos de armazenamento para as partes inteira e fracionária de cada valor são determinados separadamente. Cada múltiplo de nove dígitos requer 4 bytes, e quaisquer dígitos restantes deixados para trás requerem alguma fração de 4 bytes. O armazenamento necessário para os dígitos restantes é dado pela tabela a seguir.

<table><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Dígitos Restantes</th> <th>Número de Bytes</th> </tr></thead><tbody><tr> <td>0</td> <td>0</td> </tr><tr> <td>1–2</td> <td>1</td> </tr><tr> <td>3–4</td> <td>2</td> </tr><tr> <td>5–6</td> <td>3</td> </tr><tr> <td>7–9</td> <td>4</td> </tr></tbody></table>

Por exemplo, uma coluna `DECIMAL(18,9)` tem nove dígitos de cada lado do ponto decimal, então a parte inteira e a parte fracionária exigem cada uma 4 bytes. Uma coluna `DECIMAL(20,6)` tem catorze dígitos inteiros e seis dígitos fracionários. Os dígitos inteiros exigem quatro bytes para nove dos dígitos e 3 bytes para os cinco dígitos restantes. Os seis dígitos fracionários exigem 3 bytes.

Colunas `DECIMAL` - DECIMAL, NUMERIC") não armazenam um caractere `+` ou `-` inicial ou dígitos iniciais `0`. Se você inserir `+0003.1` em uma coluna `DECIMAL(5,1)`, ela é armazenada como `3.1`. Para números negativos, um literal `-` não é armazenado.

Colunas `DECIMAL` - DECIMAL, NUMERIC") não permitem valores maiores que o intervalo implícito pela definição da coluna. Por exemplo, uma coluna `DECIMAL(3,0)` suporta um intervalo de `-999` a `999`. Uma coluna `DECIMAL(M,D)` permite até *`M`* - *`D`* dígitos à esquerda do ponto decimal.

O padrão SQL exige que a precisão de `NUMERIC(M,D)` seja *exatamente* *`M`* dígitos. Para `DECIMAL(M,D)`, o padrão exige uma precisão de pelo menos *`M`* dígitos, mas permite mais. No MySQL, `DECIMAL(M,D)` e `NUMERIC(M,D)` são a mesma coisa, e ambos têm uma precisão de exatamente *`M`* dígitos.

Para uma explicação completa do formato interno dos valores `DECIMAL`, consulte o arquivo `strings/decimal.c` em uma distribuição de código-fonte do MySQL. O formato é explicado (com um exemplo) na função `decimal2bin()`.