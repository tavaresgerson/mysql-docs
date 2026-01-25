#### 8.2.4.3 Otimizando Instruções DELETE

O tempo necessário para excluir linhas individuais em uma tabela `MyISAM` é exatamente proporcional ao número de `Indexes`. Para excluir linhas mais rapidamente, você pode aumentar o tamanho do `key cache` elevando a `system variable` `key_buffer_size`. Consulte a Seção 5.1.1, “Configurando o Servidor”.

Para excluir todas as linhas de uma tabela `MyISAM`, `TRUNCATE TABLE tbl_name` é mais rápido do que `DELETE FROM tbl_name`. As operações de Truncate não são `transaction-safe`; um erro ocorre ao tentar realizar uma durante o curso de uma `transaction` ativa ou um `table lock` ativo. Consulte a Seção 13.1.34, “Instrução TRUNCATE TABLE”.