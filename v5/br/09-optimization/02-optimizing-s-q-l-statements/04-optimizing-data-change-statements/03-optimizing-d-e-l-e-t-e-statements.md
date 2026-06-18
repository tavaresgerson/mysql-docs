#### 8.2.4.3 Otimizando instruções DELETE

O tempo necessário para excluir linhas individuais em uma tabela `MyISAM` é exatamente proporcional ao número de índices. Para excluir as linhas mais rapidamente, você pode aumentar o tamanho do cache de chaves aumentando a variável de sistema `key_buffer_size`. Veja a Seção 5.1.1, “Configurando o Servidor”.

Para excluir todas as linhas de uma tabela `MyISAM`, `TRUNCATE TABLE tbl_name` é mais rápido do que `DELETE FROM tbl_name`. As operações de truncar não são seguras em transações; um erro ocorre ao tentar uma delas durante uma transação ativa ou bloqueio de tabela ativo. Consulte a Seção 13.1.34, “Instrução TRUNCATE TABLE”.
