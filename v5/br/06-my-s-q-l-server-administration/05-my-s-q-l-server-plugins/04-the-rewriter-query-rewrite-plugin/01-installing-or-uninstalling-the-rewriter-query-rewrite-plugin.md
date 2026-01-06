#### 5.5.4.1 Instalar ou desinstalar o plugin de reescrita de consultas Rewriter

Nota

Se instalado, o plugin `Rewriter` gera algum overhead mesmo quando desativado. Para evitar esse overhead, não instale o plugin a menos que você planeje usá-lo.

Para instalar ou desinstalar o plugin de reescrita de consultas `Rewriter`, escolha o script apropriado localizado no diretório `share` da sua instalação do MySQL:

- `install_rewriter.sql`: Escolha este script para instalar o plugin `Rewriter` e seus elementos associados.

- `uninstall_rewriter.sql`: Escolha este script para desinstalar o plugin `Rewriter` e seus elementos associados.

Execute o script escolhido da seguinte forma:

```sql
$> mysql -u root -p < install_rewriter.sql
Enter password: (enter root password here)
```

O exemplo aqui usa o script de instalação `install_rewriter.sql`. Substitua `uninstall_rewriter.sql` se você estiver desinstalando o plugin.

Ao executar um script de instalação, o plugin deve ser instalado e habilitado. Para verificar isso, conecte-se ao servidor e execute a seguinte instrução:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'rewriter_enabled';
+------------------+-------+
| Variable_name    | Value |
+------------------+-------+
| rewriter_enabled | ON    |
+------------------+-------+
```

Para instruções de uso, consulte Seção 5.5.4.2, “Usando o Plugin de Reescrita de Consultas de Reescritor”. Para informações de referência, consulte Seção 5.5.4.3, “Referência do Plugin de Reescrita de Consultas de Reescritor”.
