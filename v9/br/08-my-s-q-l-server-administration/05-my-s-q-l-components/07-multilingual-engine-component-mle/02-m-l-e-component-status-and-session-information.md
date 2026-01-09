#### 7.5.7.2 Status e Informações de Sessão do Componente MLE

Depois que o componente MLE é instalado, você pode obter informações sobre o componente conforme mostrado aqui:

```
mysql> SHOW STATUS LIKE 'mle%';
+-------------------------+---------------+
| Variable_name           | Value         |
+-------------------------+---------------+
| mle_heap_status         | Not Allocated |
| mle_languages_supported | JavaScript    |
| mle_memory_used         | 0             |
| mle_status              | Inactive      |
+-------------------------+---------------+
4 rows in set (0.01 sec)
```

Assim como outras variáveis de status do MySQL, você também pode acessar as mostradas aqui selecionando da tabela `global_status` do Schema de Desempenho.

O status do componente MLE é indicado pela variável de status `mle_status`. Ela permanece `Inativa` até que um usuário crie ou invoque um procedimento armazenado ou função usando uma linguagem suportada pelo MLE, momento em que ela se torna (muito brevemente) `Inicializando` ou (mais comumente) `Ativo`. Ela permanece `Ativo` até que o servidor seja desligado ou reiniciado, momento em que o valor é `Pendente de desligamento`.

Você pode obter informações de status e saída de console de um programa armazenado MLE usando a função carregável `mle_session_state()` fornecida pelo componente MLE. Veja a descrição dessa função para mais informações.

`mle_languages_supported` mostra uma lista de idiomas suportados por essa instância do componente; no MySQL 9.5, isso é sempre `JavaScript`.

Veja a Seção 7.5.7.3, “Uso de Memória e Fuso dos Componentes MLE”, para informações sobre variáveis de status relacionadas ao uso de memória do componente MLE.

Você também pode obter informações sobre sessões MLE de variáveis de status do sistema. A variável de status `mle_sessions` fornece o número de sessões MLE ativas. `mle_sessions_max` exibe o maior número de sessões MLE ativas simultaneamente em qualquer momento desde que o componente MLE se tornou ativo. `mle_session_resets` mostra o número de vezes que o estado da sessão foi limpo chamando `mle_session_reset()`. Veja as descrições dessas variáveis de status para mais informações.

Os contos de várias declarações SQL da biblioteca JavaScript são mantidos como variáveis de status. Estes incluem `Com_create_library`, `Com_drop_library`, `Com_alter_library`, `Com_show_create_library` e `Com_show_library_status`; estes indicam, respectivamente, os números de declarações `CREATE LIBRARY`, `DROP LIBRARY`, `ALTER LIBRARY`, `SHOW CREATE LIBRARY` e `SHOW LIBRARY STATUS` executadas. Para mais informações, consulte as variáveis Com_xxx.