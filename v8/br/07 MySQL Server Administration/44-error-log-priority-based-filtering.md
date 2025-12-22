#### 7.4.2.5 Filtragem do registo de erros com base na prioridade (log\_filter\_internal)

O componente de filtro de registro `log_filter_internal` implementa uma forma simples de filtragem de registro com base na prioridade do evento de erro e no código de erro. Para afetar como o `log_filter_internal` permite ou suprime erros, avisos e eventos de informação destinados ao registro de erros, defina as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`.

Se este filtro estiver desativado, o `log_error_verbosity` e o `log_error_suppression_list` não terão efeito, portanto, a filtragem deve ser realizada usando outro serviço de filtro em vez disso, quando desejado (por exemplo, com regras de filtro individuais ao usar o `log_filter_dragnet`).

- Filtragem de verbosidade
- Filtragem por lista de supressão
- Verbosidade e Interação com a Lista de Repressão

##### Filtragem de verbosidade

Os eventos destinados ao log de erros têm uma prioridade de `ERROR`, `WARNING`, ou `INFORMATION`. A variável do sistema `log_error_verbosity` controla a verbosidade com base em quais prioridades permitir mensagens escritas no log, como mostrado na tabela a seguir.

<table><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Valor do log_error_verbosity</th> <th>Prioridades de mensagens permitidas</th> </tr></thead><tbody><tr> <td>1 .</td> <td>[[<code>ERROR</code>]]</td> </tr><tr> <td>2 .</td> <td>[[<code>ERROR</code>]], [[<code>WARNING</code>]]</td> </tr><tr> <td>3 .</td> <td>[[<code>ERROR</code>]], [[<code>WARNING</code>]], [[<code>INFORMATION</code>]]</td> </tr></tbody></table>

Se `log_error_verbosity` for 2 ou maior, o servidor registra mensagens sobre instruções que não são seguras para registro baseado em instruções. Se o valor for 3, o servidor registra conexões abortadas e erros de negação de acesso para novas tentativas de conexão. Veja Seção B.3.2.9,  Erros de comunicação e conexões abortadas.

Se você usar a replicação, recomenda-se um valor `log_error_verbosity` de 2 ou maior, para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas de rede e reconexões.

Se `log_error_verbosity` é 2 ou maior em uma réplica, a réplica imprime mensagens para o log de erro para fornecer informações sobre seu status, como o log binário e as coordenadas do log de retransmissão onde ele começa seu trabalho, quando está mudando para outro log de retransmissão, quando se reconecta após uma desconexão, e assim por diante.

Há também uma prioridade de mensagem de `SYSTEM` que não está sujeita a filtragem de verbosidade. Mensagens do sistema sobre situações sem erros são impressas no log de erros independentemente do valor de `log_error_verbosity`.

No registro de erros do MySQL, as mensagens do sistema são rotuladas como Sistema. Outras sincas de registro podem ou não seguir a mesma convenção, e nos registros resultantes, as mensagens do sistema podem ser atribuídas o rótulo usado para o nível de prioridade de informação, como Nota ou Informação. Se você aplicar qualquer filtragem ou redirecionamento adicional para o registro com base na rotulagem de mensagens, as mensagens do sistema não substituem seu filtro, mas são tratadas da mesma maneira que outras mensagens.

##### Filtragem por lista de supressão

A variável de sistema `log_error_suppression_list` aplica-se a eventos destinados ao log de erros e especifica quais eventos devem ser suprimidos quando ocorrem com uma prioridade de `WARNING` ou `INFORMATION`. Por exemplo, se um tipo particular de aviso é considerado indesejável ruído no log de erros porque ocorre com freqüência, mas não é de interesse, ele pode ser suprimido. `log_error_suppression_list` não suprime mensagens com uma prioridade de `ERROR` ou `SYSTEM`.

O valor `log_error_suppression_list` pode ser a cadeia vazia para nenhuma supressão, ou uma lista de um ou mais valores separados por vírgula indicando os códigos de erro a serem suprimidos. Os códigos de erro podem ser especificados em forma simbólica ou numérica. Um código numérico pode ser especificado com ou sem o prefixo `MY-` . Os zeros iniciais na parte numérica não são significativos.

```
ER_SERVER_SHUTDOWN_COMPLETE
MY-000031
000031
MY-31
31
```

Para efeitos de legibilidade e portabilidade, os valores simbólicos são preferíveis aos valores numéricos.

Embora os códigos a suprimir possam ser expressos em forma simbólica ou numérica, o valor numérico de cada código deve estar dentro de um intervalo permitido:

- 1 a 999: Códigos de erro globais utilizados tanto pelo servidor como pelos clientes.
- 10000 e superior: Códigos de erro do servidor destinados a ser escritos no registo de erros (não enviados aos clientes).

Além disso, cada código de erro especificado deve realmente ser usado pelo MySQL. Tentativas de especificar um código não dentro de um intervalo permitido ou dentro de um intervalo permitido, mas não usado pelo MySQL, produzem um erro e o valor `log_error_suppression_list` permanece inalterado.

Para obter informações sobre os intervalos de códigos de erro e os símbolos e números de erro definidos dentro de cada intervalo, consulte a Seção B.1, "Fontes e elementos de mensagem de erro" e a Referência de mensagem de erro do MySQL 8.4.

O servidor pode gerar mensagens para um determinado código de erro em diferentes prioridades, então a supressão de uma mensagem associada a um código de erro listado em `log_error_suppression_list` depende de sua prioridade.

- As mensagens geradas com uma prioridade de `WARNING` ou `INFORMATION` são suprimidas.
- As mensagens geradas com uma prioridade de `ERROR` ou `SYSTEM` não são suprimidas.

##### Verbosidade e Interação com a Lista de Repressão

O efeito de `log_error_verbosity` combina com o de `log_error_suppression_list`.

```
[mysqld]
log_error_verbosity=2     # error and warning messages only
log_error_suppression_list='ER_PARSER_TRACE,MY-010001,10002'
```

Neste caso, o `log_error_verbosity` permite mensagens com prioridade `ERROR` ou `WARNING` e descarta mensagens com prioridade `INFORMATION`.

::: info Note

O `log_error_verbosity` valor de 2 mostrado no exemplo também é o seu valor padrão, então o efeito desta variável nas mensagens de `INFORMATION` é como descrito por padrão, sem uma configuração explícita. Você deve definir `log_error_verbosity` para 3 se quiser que `log_error_suppression_list` afete mensagens com `INFORMATION` prioridade.

:::

Considere um servidor iniciado com esta configuração:

```
[mysqld]
log_error_verbosity=1     # error messages only
```

Neste caso, o `log_error_verbosity` permite mensagens com prioridade `ERROR` e descarta mensagens com prioridade `WARNING` ou `INFORMATION`. A configuração do `log_error_suppression_list` não tem efeito porque todos os códigos de erro que pode suprimir já foram descartados devido à configuração do `log_error_verbosity`.
