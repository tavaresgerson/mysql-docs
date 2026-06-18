#### 7.4.2.5 Filtragem do log de erros com prioridade (log\_filter\_internal)

O componente de filtro de registro `log_filter_internal` implementa uma forma simples de filtragem de registros baseada na prioridade do evento de erro e no código de erro. Para influenciar como o `log_filter_internal` permite ou suprime eventos de erro, aviso e informações destinados ao log de erro, defina as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`.

`log_filter_internal` é integrado e ativado por padrão. Se este filtro for desativado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito, portanto, o filtro deve ser realizado usando outro serviço de filtro, se desejado (por exemplo, com regras de filtro individuais ao usar `log_filter_dragnet`). Para informações sobre a configuração do log de erro, consulte a Seção 7.4.2.1, “Configuração do Log de Erro”.

- Filtragem de verbosidade
- Filtragem de lista de supressão
- Interação entre a Verbosidade e a Lista de Supressão

##### Filtragem de verbosidade

Os eventos destinados ao log de erros têm uma prioridade de `ERROR`, `WARNING` ou `INFORMATION`. A variável de sistema `log_error_verbosity` controla a verbosidade com base nas prioridades permitidas para as mensagens escritas no log, conforme mostrado na tabela a seguir.

<table summary="Valores permitidos para log_error_verbosity e as prioridades de mensagem correspondentes permitidas."><thead><tr> <th>log_error_verbosity Valor</th> <th>Prioridades de Mensagens Permitidas</th> </tr></thead><tbody><tr> <td>1</td> <td>[[<code>ERROR</code>]]</td> </tr><tr> <td>2</td> <td>[[<code>ERROR</code>]], [[<code>WARNING</code>]]</td> </tr><tr> <td>3</td> <td>[[<code>ERROR</code>]], [[<code>WARNING</code>]], [[<code>INFORMATION</code>]]</td> </tr></tbody></table>

Se `log_error_verbosity` for igual ou maior que 2, o servidor registra mensagens sobre declarações que são inseguras para o registro baseado em declarações. Se o valor for 3, o servidor registra conexões abortadas e erros de acesso negado para novas tentativas de conexão. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

Se você usar a replicação, é recomendado um valor de `log_error_verbosity` de 2 ou superior, para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas na rede e reconexões.

Se o `log_error_verbosity` for 2 ou superior em uma réplica, a réplica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de retransmissão onde ela começa seu trabalho, quando está passando para outro log de retransmissão, quando se reconecta após uma desconexão, e assim por diante.

Há também uma prioridade de mensagem `SYSTEM` que não está sujeita ao filtro de verbosidade. Mensagens do sistema sobre situações que não são erros são impressas no log de erros, independentemente do valor `log_error_verbosity`. Essas mensagens incluem mensagens de inicialização e desligamento, bem como algumas alterações significativas nas configurações.

No log de erros do MySQL, as mensagens do sistema são rotuladas como “Sistema”. Outros pontos de destino de logs podem ou não seguir a mesma convenção, e nos logs resultantes, as mensagens do sistema podem receber a etiqueta usada para o nível de prioridade da informação, como “Nota” ou “Informações”. Se você aplicar qualquer filtragem ou redirecionamento adicional para o registro baseado na rotulagem das mensagens, as mensagens do sistema não substituem seu filtro, mas são tratadas por ele da mesma maneira que outras mensagens.

##### Filtragem de lista de supressão

A variável de sistema `log_error_suppression_list` se aplica a eventos destinados ao log de erros e especifica quais eventos devem ser suprimidos quando ocorrerem com uma prioridade de `WARNING` ou `INFORMATION`. Por exemplo, se um determinado tipo de aviso é considerado um "ruído" indesejável no log de erros porque ocorre frequentemente, mas não é de interesse, ele pode ser suprimido. `log_error_suppression_list` não suprime mensagens com uma prioridade de `ERROR` ou `SYSTEM`.

O valor `log_error_suppression_list` pode ser uma string vazia para nenhuma supressão ou uma lista de um ou mais valores separados por vírgula que indicam os códigos de erro a serem suprimidos. Os códigos de erro podem ser especificados em forma simbólica ou numérica. Um código numérico pode ser especificado com ou sem o prefixo `MY-`. Zeros iniciais na parte numérica não são significativos. Exemplos de formatos de código permitidos:

```
ER_SERVER_SHUTDOWN_COMPLETE
MY-000031
000031
MY-31
31
```

Para a legibilidade e portabilidade, os valores simbólicos são preferíveis aos valores numéricos.

Embora os códigos que devem ser suprimidos possam ser expressos em forma simbólica ou numérica, o valor numérico de cada código deve estar dentro de um intervalo permitido:

- 1 a 999: Códigos de erro globais que são usados pelo servidor e pelos clientes.

- 10000 e superior: códigos de erro do servidor destinados a serem escritos no log de erro (não enviados aos clientes).

Além disso, cada código de erro especificado deve realmente ser usado pelo MySQL. Tentativas de especificar um código que não esteja dentro de um intervalo permitido ou dentro de um intervalo permitido, mas não usado pelo MySQL, produzem um erro e o valor `log_error_suppression_list` permanece inalterado.

Para obter informações sobre os intervalos de códigos de erro e os símbolos e números de erro definidos dentro de cada intervalo, consulte a Seção B.1, “Fontes e elementos dos mensagens de erro”, e o Referência de Mensagens de Erro do MySQL 8.0.

O servidor pode gerar mensagens para um código de erro específico com diferentes prioridades, portanto, a supressão de uma mensagem associada a um código de erro listado em `log_error_suppression_list` depende de sua prioridade. Suponha que a variável tenha o valor `'ER_PARSER_TRACE,MY-010001,10002'`. Então, `log_error_suppression_list` tem esses efeitos nas mensagens para esses códigos:

- Mensagens geradas com uma prioridade de `WARNING` ou `INFORMATION` são suprimidas.

- Mensagens geradas com uma prioridade de `ERROR` ou `SYSTEM` não são suprimidas.

##### Interação entre a Verbosidade e a Lista de Supressão

O efeito de `log_error_verbosity` se combina com o de `log_error_suppression_list`. Considere um servidor iniciado com essas configurações:

```
[mysqld]
log_error_verbosity=2     # error and warning messages only
log_error_suppression_list='ER_PARSER_TRACE,MY-010001,10002'
```

Neste caso, `log_error_verbosity` permite mensagens com prioridade `ERROR` ou `WARNING` e descarta mensagens com prioridade `INFORMATION`. Das mensagens não descartadas, `log_error_suppression_list` descarta mensagens com prioridade `WARNING` e quaisquer dos códigos de erro mencionados.

Nota

O valor `log_error_verbosity` de 2 mostrado no exemplo também é seu valor padrão, portanto, o efeito desta variável nas mensagens `INFORMATION` é como foi descrito anteriormente, sem configuração explícita. Você deve definir `log_error_verbosity` para 3 se quiser que `log_error_suppression_list` afete mensagens com prioridade `INFORMATION`.

Considere um servidor iniciado com essa configuração:

```
[mysqld]
log_error_verbosity=1     # error messages only
```

Neste caso, `log_error_verbosity` permite mensagens com prioridade `ERROR` e descarta mensagens com prioridade `WARNING` ou `INFORMATION`. A configuração de `log_error_suppression_list` não tem efeito, pois todos os códigos de erro que ele pode suprimir já são descartados devido à configuração de `log_error_verbosity`.
