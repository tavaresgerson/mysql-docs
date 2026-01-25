### 9.2.1 Limites de Comprimento de Identificadores

A tabela a seguir descreve o comprimento máximo para cada tipo de identificador.

<table summary="O comprimento máximo para cada tipo de identificador de objeto MySQL."><col style="width: 15%"/><col style="width: 15%"/><thead><tr> <th>Tipo de Identificador</th> <th>Comprimento Máximo (caracteres)</th> </tr></thead><tbody><tr> <td>Database</td> <td>64 (storage engine <code>NDB</code>: 63)</td> </tr><tr> <td>Table</td> <td>64 (storage engine <code>NDB</code>: 63)</td> </tr><tr> <td>Column</td> <td>64</td> </tr><tr> <td>Index</td> <td>64</td> </tr><tr> <td>Constraint</td> <td>64</td> </tr><tr> <td>Programa Armazenado</td> <td>64</td> </tr><tr> <td>View</td> <td>64</td> </tr><tr> <td>Tablespace</td> <td>64</td> </tr><tr> <td>Server</td> <td>64</td> </tr><tr> <td>Grupo de Arquivos de Log</td> <td>64</td> </tr><tr> <td>Alias</td> <td>256 (veja exceção após a tabela)</td> </tr><tr> <td>Rótulo de Instrução Composta</td> <td>16</td> </tr><tr> <td>Variável Definida pelo Usuário</td> <td>64</td> </tr> </tbody></table>

Aliases para nomes de Column em instruções `CREATE VIEW` são verificados em relação ao comprimento máximo de Column de 64 caracteres (não o comprimento máximo de Alias de 256 caracteres).

Para definições de Constraint que não incluem um nome de Constraint, o Server gera internamente um nome derivado do nome da Table associada. Por exemplo, nomes de Constraint de Foreign Key gerados internamente consistem no nome da Table mais `_ibfk_` e um número. Se o nome da Table estiver próximo do limite de comprimento para nomes de Constraint, os caracteres adicionais necessários para o nome da Constraint podem fazer com que esse nome exceda o limite, resultando em um erro.

Identificadores são armazenados usando Unicode (UTF-8). Isso se aplica a identificadores em definições de Table que são armazenados em arquivos `.frm` e a identificadores armazenados nas grant tables no Database `mysql`. Os tamanhos das colunas de string de identificador nas grant tables são medidos em caracteres. Você pode usar caracteres multibyte sem reduzir o número de caracteres permitidos para valores armazenados nessas colunas.

NDB Cluster impõe um comprimento máximo de 63 caracteres para nomes de Database e Table. Consulte a Seção 21.2.7.5, “Limites Associados a Objetos de Database no NDB Cluster”.

Valores como nome de usuário e nomes de host em nomes de contas MySQL são strings em vez de identificadores. Para obter informações sobre o comprimento máximo desses valores, conforme armazenados nas grant tables, consulte Propriedades da Coluna de Escopo da Grant Table.