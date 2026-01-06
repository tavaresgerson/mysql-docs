## 10.14 Adicionando uma Codificação a um Conjunto de Caracteres

10.14.1 Tipos de implementação de colagem

10.14.2 Escolher um ID de collation

10.14.3 Adicionando uma Colagem Simples a um Conjunto de Caracteres de 8 Bits

10.14.4 Adicionando uma Codificação UCA a um Conjunto de Caracteres Unicode

Uma correspondência é um conjunto de regras que define como comparar e ordenar cadeias de caracteres. Cada correspondência no MySQL pertence a um único conjunto de caracteres. Cada conjunto de caracteres tem pelo menos uma correspondência e a maioria tem duas ou mais correspondências.

Uma ordenação de collation ordena os caracteres com base nos pesos. Cada caractere em um conjunto de caracteres é mapeado para um peso. Caracteres com pesos iguais são comparados como iguais, e caracteres com pesos desiguais são comparados de acordo com a magnitude relativa de seus pesos.

A função `WEIGHT_STRING()` pode ser usada para ver os pesos dos caracteres em uma string. O valor que ela retorna para indicar os pesos é uma string binária, então é conveniente usar `HEX(WEIGHT_STRING(str))` para exibir os pesos em formato imprimível. O exemplo a seguir mostra que os pesos não diferem para maiúsculas e minúsculas para as letras em `'AaBb'` se for uma string não binária e sensível a maiúsculas e minúsculas, mas diferem se for uma string binária:

```sql
mysql> SELECT HEX(WEIGHT_STRING('AaBb' COLLATE latin1_swedish_ci));
+------------------------------------------------------+
| HEX(WEIGHT_STRING('AaBb' COLLATE latin1_swedish_ci)) |
+------------------------------------------------------+
| 41414242                                             |
+------------------------------------------------------+
mysql> SELECT HEX(WEIGHT_STRING(BINARY 'AaBb'));
+-----------------------------------+
| HEX(WEIGHT_STRING(BINARY 'AaBb')) |
+-----------------------------------+
| 41614262                          |
+-----------------------------------+
```

O MySQL suporta várias implementações de cotação, conforme discutido na Seção 10.14.1, “Tipos de Implementação de Cotação”. Algumas dessas podem ser adicionadas ao MySQL sem recompilar:

- Coleções simples para conjuntos de caracteres de 8 bits.
- Colagens baseadas em UCA para conjuntos de caracteres Unicode.
- Colagens binárias (`xxx_bin`).

As seções a seguir descrevem como adicionar colateções definidas pelo usuário dos dois primeiros tipos a conjuntos de caracteres existentes. Todos os conjuntos de caracteres existentes já possuem uma colateção binária, portanto, não há necessidade de descrever como adicionar uma.

Resumo do procedimento para adicionar uma nova ordenação definida pelo usuário:

1. Escolha um ID de ordenação.

2. Adicione informações de configuração que nomeiem a concordância e descrevam as regras de ordenação de caracteres.

3. Reinicie o servidor.

4. Verifique se o servidor reconhece a codificação.

As instruções aqui cobrem apenas as collation definidas pelo usuário que podem ser adicionadas sem recompilar o MySQL. Para adicionar uma collation que exija a recompilação (como implementada por meio de funções em um arquivo de código-fonte C), use as instruções na Seção 10.13, “Adicionando um Conjunto de Caracteres”. No entanto, em vez de adicionar todas as informações necessárias para um conjunto de caracteres completo, basta modificar os arquivos apropriados para um conjunto de caracteres existente. Ou seja, com base no que já está presente para as collation atuais do conjunto de caracteres, adicione estruturas de dados, funções e informações de configuração para a nova collation.

Nota

Se você modificar uma colagem definida pelo usuário existente, isso pode afetar a ordem das linhas para índices em colunas que utilizam a colagem. Nesse caso, reconstrua quaisquer índices desse tipo para evitar problemas, como resultados de consultas incorretos. Consulte a Seção 2.10.12, “Reconstrução ou reparo de tabelas ou índices”.

### Recursos adicionais

- Exemplo mostrando como adicionar uma concordância para pesquisas de texto completo: Seção 12.9.7, “Adicionar uma Concordância Definida pelo Usuário para Indexação de Texto Completo”

- A especificação do Algoritmo de Cotação Unicode (UCA): <http://www.unicode.org/reports/tr10/>

- A especificação Locale Data Markup Language (LDML): <http://www.unicode.org/reports/tr35/>
