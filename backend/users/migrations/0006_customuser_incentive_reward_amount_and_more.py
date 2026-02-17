from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("users", "0005_customuser_deactivated_until_customuser_trust_score_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="customuser",
            name="incentive_reward_amount",
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="customuser",
            name="incentive_reward_granted",
            field=models.BooleanField(default=False),
        ),
    ]
