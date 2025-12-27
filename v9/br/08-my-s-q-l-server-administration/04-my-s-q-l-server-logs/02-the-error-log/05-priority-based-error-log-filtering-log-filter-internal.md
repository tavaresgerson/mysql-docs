#### 7.4.2.5 Filtragem do Log de Erros com Base na Prioridade (log_filter_internal)

O componente de filtro de log `log_filter_internal` implementa uma forma simples de filtragem de log com base na prioridade do evento de erro e no código de erro. Para determinar como o `log_filter_internal` permite ou suprime eventos de erro, aviso e informações destinados ao log de erro, defina as variáveis de sistema `log_error_verbosity` e `log_error_suppression_list`.

`log_filter_internal` é integrado e ativado por padrão. Se este filtro for desativado, `log_error_verbosity` e `log_error_suppression_list` não terão efeito, então a filtragem deve ser realizada usando outro serviço de filtro, se desejado (por exemplo, com regras de filtro individuais ao usar `log_filter_dragnet`). Para informações sobre a configuração do filtro, consulte a Seção 7.4.2.1, “Configuração do Log de Erros”.

* Filtragem de Verbosidade
* Filtragem de Lista de Supressão
* Interação de Verbosidade e Lista de Supressão

##### Filtragem de Verbosidade

Eventos destinados ao log de erro têm uma prioridade de `ERROR`, `WARNING` ou `INFORMATION`. A variável de sistema `log_error_verbosity` controla a verbosidade com base nas prioridades permitidas para mensagens escritas no log, conforme mostrado na tabela a seguir.

<table summary="Valores de log_error_verbosity permitidos e prioridades de mensagens permitidas."><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>log_error_verbosity Value</th> <th>Permitted Message Priorities</th> </tr></thead><tbody><tr> <td>1</td> <td><code class="literal">ERROR</code></td> </tr><tr> <td>2</td> <td><code class="literal">ERROR</code>, <code class="literal">WARNING</code></td> </tr><tr> <td>3</td> <td><code class="literal">ERROR</code>, <code class="literal">WARNING</code>, <code class="literal">INFORMATION</code></td> </tr></tbody></table>

Se `log_error_verbosity` for 2 ou maior, o servidor registra mensagens sobre declarações que são inseguras para o registro baseado em declarações. Se o valor for 3, o servidor registra conexões abortadas e erros de negação de acesso para novas tentativas de conexão. Veja a Seção B.3.2.9, “Erros de Comunicação e Conexões Abortadas”.

Se você usar replicação, um valor de `log_error_verbosity` de 2 ou maior é recomendado para obter mais informações sobre o que está acontecendo, como mensagens sobre falhas de rede e reconexões.

Se `log_error_verbosity` for 2 ou maior em uma replica, a replica imprime mensagens no log de erro para fornecer informações sobre seu status, como as coordenadas do log binário e do log de retransmissão onde começa seu trabalho, quando está mudando para outro log de retransmissão, quando reconecta após uma desconexão, e assim por diante.

Há também uma prioridade de mensagem de `SYSTEM` que não está sujeita à filtragem de verbosidade. Mensagens do sistema sobre situações não de erro são impressas no log de erro, independentemente do valor de `log_error_verbosity`. Essas mensagens incluem mensagens de inicialização e desligamento e algumas mudanças significativas nas configurações.

No log de erro do MySQL, as mensagens do sistema são rotuladas como “Sistema”. Outros pontos de destino de log podem ou não seguir a mesma convenção, e nos logs resultantes, as mensagens do sistema podem ser atribuídas ao rótulo usado para o nível de prioridade da informação, como “Nota” ou “Informação”. Se você aplicar qualquer filtragem ou redirecionamento adicional para o registro baseado na rotulagem das mensagens, as mensagens do sistema não substituem seu filtro, mas são tratadas por ele da mesma maneira que outras mensagens.

##### Filtragem da Lista de Supressão

A variável de sistema `log_error_suppression_list` aplica-se a eventos destinados ao log de erros e especifica quais eventos devem ser suprimidos quando ocorrem com uma prioridade de `WARNING` ou `INFORMATION`. Por exemplo, se um determinado tipo de aviso é considerado um "ruído" indesejável no log de erros porque ocorre frequentemente, mas não é de interesse, ele pode ser suprimido. `log_error_suppression_list` não suprime mensagens com uma prioridade de `ERROR` ou `SYSTEM`.

O valor de `log_error_suppression_list` pode ser a string vazia para nenhuma supressão ou uma lista de um ou mais valores separados por vírgula indicando os códigos de erro a serem suprimidos. Os códigos de erro podem ser especificados na forma simbólica ou numérica. Um código numérico pode ser especificado com ou sem o prefixo `MY-`. Zeros iniciais na parte numérica não são significativos. Exemplos de formatos de código permitidos:

```
ER_SERVER_SHUTDOWN_COMPLETE
MY-000031
000031
MY-31
31
```

Para melhor legibilidade e portabilidade, os valores simbólicos são preferíveis aos valores numéricos.

Embora os códigos a serem suprimidos possam ser expressos na forma simbólica ou numérica, o valor numérico de cada código deve estar dentro de um intervalo permitido:

* 1 a 999: Códigos de erro globais que são usados pelo servidor, bem como pelos clientes.
* 10000 e superior: Códigos de erro do servidor destinados a serem escritos no log de erros (não enviados aos clientes).

Além disso, cada código especificado deve realmente ser usado pelo MySQL. Tentativas de especificar um código fora de um intervalo permitido ou dentro de um intervalo permitido, mas não usado pelo MySQL, produzem um erro e o valor de `log_error_suppression_list` permanece inalterado.

Para informações sobre os intervalos de códigos de erro e os símbolos e números de erro definidos dentro de cada intervalo, consulte a Seção B.1, “Fontes e elementos dos mensagens de erro”, e a Referência de Mensagens de Erro do MySQL 9.5.

O servidor pode gerar mensagens para um código de erro específico em diferentes prioridades, então a supressão de uma mensagem associada a um código de erro listado em `log_error_suppression_list` depende de sua prioridade. Suponha que a variável tenha o valor `'ER_PARSER_TRACE,MY-010001,10002'`. Então, `log_error_suppression_list` tem esses efeitos sobre as mensagens para esses códigos:

* Mensagens geradas com uma prioridade de `WARNING` ou `INFORMATION` são suprimidas.

* Mensagens geradas com uma prioridade de `ERROR` ou `SYSTEM` não são suprimidas.

##### Interação entre Verbosidade e Lista de Supressão

O efeito de `log_error_verbosity` se combina com o de `log_error_suppression_list`. Considere um servidor iniciado com essas configurações:

```
[mysqld]
log_error_verbosity=2     # error and warning messages only
log_error_suppression_list='ER_PARSER_TRACE,MY-010001,10002'
```

Neste caso, `log_error_verbosity` permite mensagens com prioridade `ERROR` ou `WARNING` e descarta mensagens com prioridade `INFORMATION`. Das mensagens não descartadas, `log_error_suppression_list` descarta mensagens com prioridade `WARNING` e qualquer um dos códigos de erro nomeados.

Nota

O valor de `log_error_verbosity` de 2 mostrado no exemplo é também seu valor padrão, então o efeito desta variável sobre as mensagens de `INFORMATION` é como foi descrito anteriormente por padrão, sem um ajuste explícito. Você deve definir `log_error_verbosity` para 3 se quiser que `log_error_suppression_list` afete mensagens com prioridade `INFORMATION`.

Considere um servidor iniciado com esta configuração:

```
[mysqld]
log_error_verbosity=1     # error messages only
```

Neste caso, `log_error_verbosity` permite mensagens com prioridade `ERROR` e descarta mensagens com prioridade `WARNING` ou `INFORMATION`. Definir `log_error_suppression_list` não tem efeito porque todas as mensagens que ele poderia suprimir já são descartadas devido ao ajuste de `log_error_verbosity`.