### 2.11.1 Antes de começar

Revise as informações nesta seção antes de fazer a atualização para uma versão anterior. Realize as ações recomendadas.

- Proteja seus dados fazendo um backup. O backup deve incluir o banco de dados `mysql`, que contém as tabelas do sistema MySQL. Veja a Seção 7.2, “Métodos de Backup de Banco de Dados”.

- Revise a Seção 2.11.2, "Caminhos de Downgrade", para garantir que o caminho de downgrade pretendido seja suportado.

- Consulte a Seção 2.11.3, "Notas de Downgrade", para itens que podem exigir ação antes da atualização para uma versão anterior.

  Nota

  Os procedimentos de downgrade descritos nas seções a seguir pressupõem que você está fazendo o downgrade com arquivos de dados criados ou modificados pela versão mais recente do MySQL. No entanto, se você não modificou seus dados após a atualização, o downgrade usando backups feitos *antes* da atualização para a nova versão do MySQL é recomendado. Muitas das alterações descritas na Seção 2.11.3, “Notas de Downgrade”, que exigem ação, não são aplicáveis ao fazer o downgrade usando backups feitos *antes* da atualização para a nova versão do MySQL.

- O uso de novos recursos, novas opções de configuração ou novos valores de opções de configuração que não são suportados por uma versão anterior pode causar erros ou falhas de downgrade. Antes de fazer o downgrade, desfaça as alterações resultantes do uso de novos recursos e remova as configurações que não são suportadas pela versão para a qual você está fazendo o downgrade.
