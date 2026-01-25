### 2.11.1 Antes de Começar

Revise as informações nesta seção antes de realizar o downgrade. Execute quaisquer ações recomendadas.

* Proteja seus dados realizando um backup. O backup deve incluir o database `mysql`, que contém as tabelas de sistema do MySQL. Consulte a Seção 7.2, “Métodos de Backup de Database”.

* Revise a Seção 2.11.2, “Caminhos de Downgrade” para garantir que o caminho de downgrade pretendido seja suportado.

* Revise a Seção 2.11.3, “Notas de Downgrade” para itens que possam exigir ação antes do downgrade.

  Nota

  Os procedimentos de downgrade descritos nas seções a seguir presumem que você está realizando o downgrade com arquivos de dados criados ou modificados pela versão mais recente do MySQL. No entanto, se você não modificou seus dados após o upgrade, recomenda-se realizar o downgrade usando backups feitos *antes* do upgrade para a nova versão do MySQL. Muitas das alterações descritas na Seção 2.11.3, “Notas de Downgrade” que exigem ação não são aplicáveis ao realizar o downgrade usando backups feitos *antes* do upgrade para a nova versão do MySQL.

* O uso de novos recursos, novas opções de configuração ou novos valores de opções de configuração que não são suportados por uma versão anterior pode causar erros ou falhas no downgrade. Antes de fazer o downgrade, reverta as alterações resultantes do uso de novos recursos e remova as configurações que não são suportadas pela versão para a qual você está fazendo o downgrade.